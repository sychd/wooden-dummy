# Express + typescript + nodemon
*Purpose is to set up express work with typescript + have an opportunity to use hot code reload.*
I suggest that we have some boilerplated code - server file ```./bin/www``` and some kind of
*entry* file - ```app.js``` (we'll make it ```*.ts```).  
So, here is some kind of recepie:
1. Install packages:
    ```nodemon```, ```ts-node```, ```typescript```, ```express```, ```@types/node```, ```@types/express``` (must have).  
    And others that you need or that are already in boilerplate (```morgan```, ```body-parser```, etc.).
2. tsconfig.json
Prepare ```tsconfig.json``` (something like this):
```json
{
  "compilerOptions": {
    "target": "ES2016",                          
    "module": "commonjs",                    
    "sourceMap": true,                        
    "rootDir": "./src",                     /*Where the code is*/                       
    "outDir": "./build",                    /*Where prepared js goes*/ 
    "strict": true,                           
    "baseUrl": ".",                         /*It is for our aliases*/
    "paths": {                              /*Attention! Basically not reseloved by node*/
      "modules/*": ["src/modules/*"],
      "shared/*": ["src/shared/*"],
    },                                       
    "typeRoots": [ "node_modules/@types" ], /*Avoid problems with TS problems like "WTF is require()?"*/                                       
    "types": [ "node" ],                                       
    "esModuleInterop": true                 
  },
  "include": [ "src/**/*" ]
}
```
3. Path aliases with 'module-alias' package
    1. Install ```module-alias``` package
    2. Add to your entry .ts file:
    ```javascript
        const aliases = {
            'shared': `${__dirname}/shared`,
            'modules': `${__dirname}/modules`
        };
        require('module-alias').addAliases(aliases); 
        ...
    ```
Alternatively, you can do it in ```package.json``` - check docs if you are interested.
Now relative paths from ```tsconfig.json``` will work well!
4. Create ```nodemon.json``` and fill it with:
```json
    {
    "watch": ["src"],
    "ext": "ts js",
    "ignore": ["src/**/*.spec.ts"],
    "exec": "ts-node"
    }
```
5. Go to ```./bin/www``` and  check that path to your entry *.ts file is valid: ```var app = require('../src/app.ts');```
6. Add commands to ```package.json```:
```json
  "scripts": {
    "start": "ts-node ./bin/www",
    "dev": "NODE_ENV=development && nodemon ./bin/www"
  },
```
That's all folks!


