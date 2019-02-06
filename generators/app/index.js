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

        this.campaignConfig = {
            sourceFolders: [],
            templateFolders: [],
            componentFolders: []
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
                    generator.campaignConfig.createSourcesFolder = createSourcesFolder;
                    return Promise.resolve();
                }

                return generator.prompt({
                    type: 'confirm',
                    name: 'createSourcesFolder',
                    message: 'Would you like to create a \'sources\' folder to contain your campaign documents?'
                }).then(createSourcesFolderAnswer => {
                    generator.campaignConfig.createSourcesFolder = createSourcesFolderAnswer.createSourcesFolder;
                });
            },
            askIfCreateTemplatesFolder: () => {
                let createTemplatesFolder = generator.options['createTemplatesFolder'];
                if (createTemplatesFolder) {
                    generator.campaignConfig.createTemplatesFolder = createTemplatesFolder;
                    return Promise.resolve();
                }

                return generator.prompt({
                    type: 'confirm',
                    name: 'createTemplatesFolder',
                    message: 'Would you like to create a \'templates\' folder to contain template files?'
                }).then(createTemplatesFolderAnswer => {
                    generator.campaignConfig.createTemplatesFolder = createTemplatesFolderAnswer.createTemplatesFolder;
                });
            },
            askIfCreateComponentsFolder: () => {
                let createComponentsFolder = generator.options['createComponentsFolder'];
                if (createComponentsFolder) {
                    generator.campaignConfig.createComponentsFolder = createComponentsFolder;
                    return Promise.resolve();
                }

                return generator.prompt({
                    type: 'confirm',
                    name: 'createComponentsFolder',
                    message: 'Would you like to create a \'components\' folder to contain component data files?'
                }).then(createComponentsFolderAnswer => {
                    generator.campaignConfig.createComponentsFolder = createComponentsFolderAnswer.createComponentsFolder;
                });
            }
        };

        // runn all prompts in sequence. Results can be ignored.
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
        let context = this.campaignConfig;

        if (context.createSourcesFolder) {
            this.campaignConfig.sourceFolders.push('./sources');
        }
        if (context.createTemplatesFolder) {
            this.campaignConfig.templateFolders.push('./templates');
        }
        if (context.createComponentsFolder) {
            this.campaignConfig.componentFolders.push('./components');
        }

        this.fs.copyTpl(this.sourceRoot() + '/dmbinder/campaign.json', context.campaignFolder + '/.dmbinder/campaign.json', context)

        if (context.createSourcesFolder) {
            mkdirp(path.join(context.campaignFolder, 'sources'));
        }
        if (context.createTemplatesFolder) {
            mkdirp(path.join(context.campaignFolder, 'templates'));
        }
        if (context.createComponentsFolder) {
            mkdirp(path.join(context.campaignFolder, 'components'));
        }
    }
};