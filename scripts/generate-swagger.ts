import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (query: string): Promise<string> => new Promise(res => rl.question(query, res));
const askMultiline = (query: string): Promise<string> => {
  console.log(`\n${query} (Paste JSON, then type 'EOF' on a new line and press Enter):`);
  return new Promise(resolve => {
    let content = '';
    const onLine = (line: string) => {
      if (line.trim() === 'EOF') {
        rl.removeListener('line', onLine);
        resolve(content);
      } else {
        content += line + '\n';
      }
    };
    rl.on('line', onLine);
  });
};

const inferSchema = (data: any): any => {
  if (data === null) return { type: 'string', nullable: true };
  if (Array.isArray(data)) {
    return { type: 'array', items: data.length ? inferSchema(data[0]) : { type: 'string' } };
  }
  if (typeof data === 'object') {
    const properties: any = {};
    for (const key in data) {
      properties[key] = inferSchema(data[key]);
    }
    return { type: 'object', properties };
  }
  return { type: typeof data, example: data };
};

const buildYaml = (schema: any, indent: number): string => {
  const pad = ' '.repeat(indent);
  let out = '';
  if (schema.type === 'object') {
    out += `${pad}type: object\n`;
    if (Object.keys(schema.properties || {}).length > 0) {
      out += `${pad}properties:\n`;
      for (const [k, v] of Object.entries(schema.properties)) {
        out += `${pad}  ${k}:\n${buildYaml(v as any, indent + 4)}`;
      }
    }
  } else if (schema.type === 'array') {
    out += `${pad}type: array\n${pad}items:\n${buildYaml(schema.items, indent + 2)}`;
  } else {
    out += `${pad}type: ${schema.type}\n`;
    if (schema.example !== undefined) {
      let exampleStr = typeof schema.example === 'string' ? `"${schema.example}"` : schema.example;
      out += `${pad}example: ${exampleStr}\n`;
    }
  }
  return out;
};

const main = async () => {
  console.log('🚀 Welcome to the Swagger Auto-Generator!\n');
  
  const tag = await ask('1. Which feature Tag does this belong to? (e.g. Auth, Users): ');
  const method = (await ask('2. HTTP Method? (get, post, put, delete): ')).toLowerCase();
  const endpoint = await ask('3. Endpoint Path? (e.g. /auth/login): ');
  const summary = await ask('4. Brief Summary? (e.g. Login user into the system): ');
  
  const reqJsonStr = await askMultiline('5. Request Body JSON (Leave empty if GET/DELETE)');
  const reqObj = reqJsonStr.trim() ? JSON.parse(reqJsonStr) : null;
  
  const resSuccessStr = await askMultiline('6. Success Response JSON (200/201)');
  const resSuccessObj = resSuccessStr.trim() ? JSON.parse(resSuccessStr) : null;
  
  const resErrorStr = await askMultiline('7. Error Response JSON (400/404)');
  const resErrorObj = resErrorStr.trim() ? JSON.parse(resErrorStr) : null;

  rl.close();

  let swagger = `/**\n * @swagger\n * ${endpoint}:\n *   ${method}:\n *     summary: ${summary}\n *     tags: [${tag}]\n`;
  
  if (reqObj) {
    swagger += ` *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n`;
    const reqYaml = buildYaml(inferSchema(reqObj), 12);
    swagger += reqYaml.split('\n').filter(l => l.trim()).map(l => ` * ${l}`).join('\n') + '\n';
  }
  
  swagger += ` *     responses:\n`;
  
  if (resSuccessObj) {
    const code = method === 'post' ? '201' : '200';
    swagger += ` *       ${code}:\n *         description: Success\n *         content:\n *           application/json:\n *             schema:\n`;
    const resYaml = buildYaml(inferSchema(resSuccessObj), 14);
    swagger += resYaml.split('\n').filter(l => l.trim()).map(l => ` * ${l}`).join('\n') + '\n';
  } else {
    const code = method === 'post' ? '201' : '200';
    swagger += ` *       ${code}:\n *         description: Success\n`;
  }
  
  if (resErrorObj) {
    swagger += ` *       400:\n *         description: Error processing request\n *         content:\n *           application/json:\n *             schema:\n`;
    const errYaml = buildYaml(inferSchema(resErrorObj), 14);
    swagger += errYaml.split('\n').filter(l => l.trim()).map(l => ` * ${l}`).join('\n') + '\n';
  }
  swagger += ` */\n\n`;

  const fileName = tag.toLowerCase().replace(/\s+/g, '-') + '.docs.ts';
  const filePath = path.join(__dirname, '../src/docs', fileName);
  
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  // Inject to file safely
  fs.appendFileSync(filePath, swagger, 'utf-8');
  console.log(`\n✅ Successfully generated Swagger block and appended it to src/docs/${fileName}!`);
};

main().catch(err => {
  console.error('\n❌ Error generating swagger:', err.message);
  rl.close();
});
