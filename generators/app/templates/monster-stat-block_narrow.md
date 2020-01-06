---
templateEngine: handlebars
---
___
> ## {{name}}
> *{{size}} {{type}}{{#subtype}} ({{this}}){{/subtype}}, {{alignment}}*
>___
> - **Armor Class** {{ac.base}}{{#ac.breakdown}} ({{this}}){{/ac.breakdown}}
> - **Hit Points** {{hp.base}}{{#hp.roll}} ({{this}}){{/hp.roll}}
{{#if speed}}
> - **Speed** {{#speed}}{{this}}{{#unless @last}}, {{/unless}}{{/speed}}
{{/if}}
>___
> |**Str**|**Dex**|**Con**|**Int**|**Wis**|**Cha**|
> |:---:|:---:|:---:|:---:|:---:|:---:|
> | {{#str}}{{base}} ({{mod}}){{/str}}{{^str}}&mdash;{{/str}} | {{#dex}}{{base}} ({{mod}}){{/dex}}{{^dex}}&mdash;{{/dex}} | {{#con}}{{base}} ({{mod}}){{/con}}{{^con}}&mdash;{{/con}} | {{#int}}{{base}} ({{mod}}){{/int}}{{^int}}&mdash;{{/int}} | {{#wis}}{{base}} ({{mod}}){{/wis}}{{^wis}}&mdash;{{/wis}} | {{#cha}}{{base}} ({{mod}}){{/cha}}{{^cha}}&mdash;{{/cha}} |
>___
{{#if saves}}
> - **Saving Throws** {{#saves}}{{name}} {{mod}}{{#unless @last}}, {{/unless}}{{/saves}}
{{/if}}
{{#if skills}}
> - **Skills** {{#skills}}{{name}} {{mod}}{{#unless @last}}, {{/unless}}{{/skills}}
{{/if}}
{{#if damageVulnerabilities}}
> - **Damage Vulnerabilities** {{#damageVulnerabilities}}{{this}}{{#unless @last}}, {{/unless}}{{/damageVulnerabilities}}
{{/if}}
{{#if damageImmunities}}
> - **Damage Immunities** {{#damageImmunities}}{{this}}{{#unless @last}}, {{/unless}}{{/damageImmunities}}
{{/if}}
{{#if damageResistances}}
> - **Damage Resistances** {{#damageResistances}}{{this}}{{#unless @last}}; {{/unless}}{{/damageResistances}}
{{/if}}
{{#if conditionImmunities}}
> - **Condition Immunities** {{#conditionImmunities}}{{this}}{{#unless @last}}, {{/unless}}{{/conditionImmunities}}
{{/if}}
{{#if senses}}
> - **Senses** {{#senses}}{{this}}{{#unless @last}}, {{/unless}}{{/senses}}
{{/if}}
{{#if languages}}
> - **Languages** {{#languages}}{{this}}{{#unless @last}}, {{/unless}}{{/languages}}
{{/if}}
{{#challenge}}
> - **Challenge** {{rating}}{{#xp}} ({{this}} XP){{/xp}}
{{/challenge}}
{{#if abilities}}
>___
{{#abilities}}
> **{{name}}.**
{{#description}}
> {{this}}
{{/description}}
> 
{{/abilities}}
{{/if}}
{{#if actions}}
> ### Actions
{{#actions}}
> **{{name}}.**
{{#description}}
> {{this}}
{{/description}}
> 
{{/actions}}
{{/if}}
{{#if reactions}}
> ### Reactions
{{#reactions}}
> **{{name}}.**
{{#description}}
> {{this}}
{{/description}}
> 
{{/reactions}}
{{/if}}
{{#if legendaryActions}}
> ### Legendary Actions
{{#legendaryActions}}
> **{{name}}.**
{{#description}}
> {{this}}
{{/description}}
> 
{{/legendaryActions}}
{{/if}}