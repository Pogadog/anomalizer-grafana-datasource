
const fs = require("fs");
const exec = require('child_process').exec;

module.exports = (config, options) => {

    // copy built plugin to shared Grafana Docker plugin directory
    config.plugins.push({
        apply: (compiler) => {
            compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                let buildPath = fs.readFileSync("./grafanaPluginDirectory.txt", 'utf-8');
                exec(`mkdir -p ${buildPath}/anomalizer-grafana-datasource && cp -r dist/ ${buildPath}/anomalizer-grafana-datasource`, (err, stdout, stderr) => {
                    process.stdout.write(`  Plugin successfully copied to ${buildPath}\n`);
                });
            });
        }
      })

    return config;
}
