set -e
NAME="$1"
dotnet new console -lang F# -n $NAME
dotnet sln add $NAME/$NAME.fsproj
cd $NAME
dotnet new tool-manifest
dotnet tool install fable
echo Feliz Fable Fable.Core Fable.Elmish Fable.Elmish.React | xargs -n 1 dotnet add package || : #this seems to give a failing return code for some reason
mkdir src
mv Program.fs src/Program.fs
sed -i 's/Program.fs/src\/Program.fs/g' $NAME.fsproj

cat << "EOF" > start.sh
#!/bin/bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR
dotnet fable
npm start
EOF
chmod u+x start.sh

mkdir dist
cat << EOF > dist/index.html
<!doctype html>
<html>
<head>
  <title>Fable</title>
  <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="shortcut icon" href="fable.ico" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css">
  <link rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
        integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
        crossorigin="anonymous" />
</head>
<body>
    <div id="elmish-app"></div>
    <script src="main.js"></script>
</body>
</html>
EOF

cat << EOF > package.json
{
  "scripts": {
    "start": "webpack-dev-server",
    "build": "webpack"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "fable-compiler": "^2.13.0",
    "fable-loader": "^2.1.9",
    "webpack": "^5.93.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.0.4"
  }
}
EOF

cat << EOF > webpack.config.js
const path = require("path")

module.exports = {
    mode: "development",
    entry: "./src/Program.fs.js",
    devtool: "eval-source-map",

    devServer: {
        devMiddleware: {
            publicPath: "/"
        },
        port: 8080,
        proxy: undefined,
        hot: true,
        static: {
            directory: path.resolve(__dirname, "./dist"),
            staticOptions: {},
        },
    },
    module: {
        rules: [{
            test: /\.fs(x|proj)?$/,
            use: "fable-loader"
        }]
    }
}
EOF

npm install
