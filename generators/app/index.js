let Generator = require('yeoman-generator');
let mkdirp = require('mkdirp');
let path = require('path');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('campaignName', { type: String });
        this.option('campaignFolder', { type: String });
        this.option('createSourcesFolder', { type: Boolean });
        this.option('createTemplatesFolder', { type: Boolean });
        this.option('createComponentsFolder', { type: Boolean });
        this.option('createGeneratorsFolder', { type: Boolean });
        this.option('createOutputFolder', { type: Boolean });

        this.actions = {
            createSourcesFolder: false,
            createTemplatesFolder: false,
            createComponentsFolder: false,
            createGeneratorsFolder: false,
            createOutputFolder: false,
            exportCustomSchema: false
        }

        this.campaignConfig = {
            sourceFolders: [],
            templateFolders: [],
            componentFolders: [],
            generatorFolders: [],
            outputFolder: null
        };
    }

    prompting() {
        let generator = this;
        let prompts = {
            askForName: () => {
                let campaignName = generator.options['campaignName'];
                if (campaignName) {
                    generator.campaignConfig.campaignName = campaignName;
                    return Promise.resolve();
                }

                return generator.prompt({
                    type: 'input',
                    name: 'campaignName',
                    message: 'What\'s the name of your campaign?'
                }).then(campaignNameAnswer => {
                    generator.campaignConfig.campaignName = campaignNameAnswer.campaignName;
                });
            },
            askForCampaignFolder: () => {
                let campaignFolder = generator.options['campaignFolder'];
                if (campaignFolder) {
                    generator.campaignConfig.campaignFolder = campaignFolder;
                    return Promise.resolve();
                }

                let def = generator.campaignConfig.campaignFolder;
                if (!def && generator.campaignConfig.campaignName) {
                    def = generator.campaignConfig.campaignName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                }
                if (!def) {
                    def == '';
                }

                return generator.prompt({
                    type: 'input',
                    name: 'campaignFolder',
                    message: 'What should the campaign folder be called?',
                    default: def
                }).then(campaignFolderAnswer => {
                    generator.campaignConfig.campaignFolder = campaignFolderAnswer.campaignFolder;
                });
            },
            askIfCreateSourcesFolder: () => {
                let createSourcesFolder = generator.options['createSourcesFolder'];
                if (createSourcesFolder) {
                    generator.actions.createSourcesFolder = createSourcesFolder;
                    return Promise.resolve();
                }

                return generator.prompt({
                    type: 'confirm',
                    name: 'createSourcesFolder',
                    message: 'Would you like to create a \'source\' folder to contain your campaign documents?'
                }).then(createSourcesFolderAnswer => {
                    generator.actions.createSourcesFolder = createSourcesFolderAnswer.createSourcesFolder;
                });
            },
            askIfCreateTemplatesFolder: () => {
                let createTemplatesFolder = generator.options['createTemplatesFolder'];
                if (createTemplatesFolder) {
                    generator.actions.createTemplatesFolder = createTemplatesFolder;
                    return Promise.resolve();
                }

                return generator.prompt({
                    type: 'confirm',
                    name: 'createTemplatesFolder',
                    message: 'Would you like to create a \'templates\' folder to contain template files?'
                }).then(createTemplatesFolderAnswer => {
                    generator.actions.createTemplatesFolder = createTemplatesFolderAnswer.createTemplatesFolder;
                });
            },
            askIfCreateComponentsFolder: () => {
                let createComponentsFolder = generator.options['createComponentsFolder'];
                if (createComponentsFolder) {
                    generator.actions.createComponentsFolder = createComponentsFolder;
                    return Promise.resolve();
                }

                return generator.prompt({
                    type: 'confirm',
                    name: 'createComponentsFolder',
                    message: 'Would you like to create a \'components\' folder to contain component data files?'
                }).then(createComponentsFolderAnswer => {
                    generator.actions.createComponentsFolder = createComponentsFolderAnswer.createComponentsFolder;
                });
            },
            askIfCreateGeneratorsFolder: () => {
                let createGeneratorsFolder = generator.options['createGeneratorsFolder'];
                if (createGeneratorsFolder) {
                    generator.actions.createGeneratorsFolder = createGeneratorsFolder;
                    return Promise.resolve();
                }

                return generator.prompt({
                    type: 'confirm',
                    name: 'createGeneratorsFolder',
                    message: 'Would you like to create a \'generators\' folder to contain content generator configuration files?'
                }).then(createGeneratorsFolderAnswer => {
                    generator.actions.createGeneratorsFolder = createGeneratorsFolderAnswer.createGeneratorsFolder;
                });
            },
            askIfCreateOutputFolder: () => {
                let createOutputFolder = generator.options['createOutputFolder'];
                if (createOutputFolder) {
                    generator.actions.createOutputFolder = createOutputFolder;
                    return Promise.resolve();
                }

                return generator.prompt({
                    type: 'confirm',
                    name: 'createOutputFolder',
                    message: 'Would you like to create a folder to which all rendered source files will be saved?'
                }).then(createOutputFolderAnswer => {
                    generator.actions.createOutputFolder = createOutputFolderAnswer.createOutputFolder;
                });

            },
            askIfGenerateExampleSource: () => {
                if (!generator.actions.createSourcesFolder) {
                    return Promise.resolve();
                }
                return generator.prompt({
                    type: 'confirm',
                    name: 'generateExampleSource',
                    message: 'Would you like to generate an example campaign document?'
                }).then(generateExampleSourceAnswer => {
                    generator.actions.generateExampleSource = generateExampleSourceAnswer.generateExampleSource;
                });
            },
            askIfGenerateExampleTemplate: () => {
                if (!generator.actions.createTemplatesFolder) {
                    return Promise.resolve();
                }
                return generator.prompt({
                    type: 'confirm',
                    name: 'generateExampleTemplate',
                    message: 'Would you like to generate an example template file?'
                }).then(generateExampleTemplateAnswer => {
                    generator.actions.generateExampleTemplate = generateExampleTemplateAnswer.generateExampleTemplate;
                });
            },
            askIfGenerateExampleComponent: () => {
                if (!generator.actions.createComponentsFolder) {
                    return Promise.resolve();
                }
                return generator.prompt({
                    type: 'confirm',
                    name: 'generateExampleComponent',
                    message: 'Would you like to generate an example component data file?'
                }).then(generateExampleComponentAnswer => {
                    generator.actions.generateExampleComponent = generateExampleComponentAnswer.generateExampleComponent;
                });
            },
            askIfExportCustomSchema: () => {
                if (!generator.actions.generateExampleTemplate || !generator.actions.createComponentsFolder) {
                    return Promise.resolve();
                }
                return generator.prompt({
                    type: 'confirm',
                    name: 'exportCustomSchema',
                    message: 'Would you like to use custom JSON schema for component files desiged to work with the example templates?'
                }).then(exportCustomSchemaAnswer => {
                    generator.actions.exportCustomSchema = exportCustomSchemaAnswer.exportCustomSchema;
                });
            }
        };

        // run all prompts in sequence. Results can be ignored.
        let result = Promise.resolve();
        for (let taskName in prompts) {
            let prompt = prompts[taskName];
            result = result.then(_ => {
                return new Promise((s, r) => {
                    setTimeout(_ => prompt().then(s, r), 0); // set timeout is required, otherwise node hangs
                });
            })
        }
        return result;
    }

    writing() {
        let context = this.actions;

        if (context.createSourcesFolder) {
            this.campaignConfig.sourceFolders.push('./source');
        }
        if (context.createTemplatesFolder) {
            this.campaignConfig.templateFolders.push('./templates');
        }
        if (context.createComponentsFolder) {
            this.campaignConfig.componentFolders.push('./components');
        }
        if (context.createGeneratorsFolder) {
            this.campaignConfig.generatorFolders.push('./generators')
        }
        if (context.createOutputFolder) {
            this.campaignConfig.outputFolder = './out';
        }

        this.fs.copy(this.sourceRoot() + '/vscode', this.campaignConfig.campaignFolder + '/.vscode');
        this.fs.copyTpl(this.sourceRoot() + '/dmbinder/campaign.json', this.campaignConfig.campaignFolder + '/.dmbinder/campaign.json', this.campaignConfig);

        if (context.createSourcesFolder) {
            mkdirp(path.join(this.campaignConfig.campaignFolder, 'source'));
            if (context.generateExampleSource) {
                if (context.generateExampleComponent && context.generateExampleTemplate) {
                    this.fs.copy(this.sourceRoot() + '/Homebrew-Basics_with-components.md', this.campaignConfig.campaignFolder + '/source/Homebrew-Basics.md');
                } else {
                    this.fs.copy(this.sourceRoot() + '/Homebrew-Basics.md', this.campaignConfig.campaignFolder + '/source/Homebrew-Basics.md');
                }
            }
        }
        if (context.createTemplatesFolder) {
            mkdirp(path.join(this.campaignConfig.campaignFolder, 'templates'));
            if (context.generateExampleTemplate) {
                this.fs.copy(this.sourceRoot() + '/monster-stat-block.md', this.campaignConfig.campaignFolder + '/templates/monster-stat-block.md');
                this.fs.copy(this.sourceRoot() + '/monster-stat-block_narrow.md', this.campaignConfig.campaignFolder + '/templates/monster-stat-block_narrow.md');
                if (context.exportCustomSchema) {
                    mkdirp(path.join(this.campaignConfig.campaignFolder, 'schemas'));
                    this.fs.copy(this.sourceRoot() + '/customComponentSchemas.json', this.campaignConfig.campaignFolder + '/schemas/customComponentSchemas.json');
                    this.fs.extendJSON(this.campaignConfig.campaignFolder + '/.vscode/settings.json', {
                        "json.schemas": [
                            {
                              "fileMatch": [
                                "components/*.json",
                                "components/**/*.json"
                              ],
                              "url": "./schemas/customComponentSchemas.json"
                            }
                          ]
                    });
                }
            }
        }
        if (context.createComponentsFolder) {
            mkdirp(path.join(this.campaignConfig.campaignFolder, 'components'));
            if (context.generateExampleComponent) {
                this.fs.copy(this.sourceRoot() + '/Owlbear.json', this.campaignConfig.campaignFolder + '/components/Owlbear.json');
                this.fs.copy(this.sourceRoot() + '/LICENSE', this.campaignConfig.campaignFolder + '/LICENSE');
            }
        }
        if (context.createGeneratorsFolder) {
            mkdirp(path.join(this.campaignConfig.campaignFolder, 'generators'));
        }
        if (context.createOutputFolder) {
            mkdirp(path.join(this.campaignConfig.campaignFolder, 'out'));
        }
    }
};