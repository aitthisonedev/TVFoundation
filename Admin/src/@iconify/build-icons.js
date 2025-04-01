"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
// Installation: npm install --save-dev @iconify/tools @iconify/utils @iconify/json @iconify/iconify
const tools_1 = require("@iconify/tools");
const utils_1 = require("@iconify/utils");
const sources = {
    svg: [
        {
            dir: 'src/assets/images/iconify-svg',
            monotone: false,
            prefix: 'custom',
        },
    ],
    icons: [
    // 'mdi:home',
    // 'mdi:account',
    // 'mdi:login',
    // 'mdi:logout',
    // 'octicon:book-24',
    // 'octicon:code-square-24',
    ],
    json: [
        require.resolve('@iconify-json/bx/icons.json'),
        require.resolve('@iconify-json/bxs/icons.json'),
        require.resolve('@iconify-json/bxl/icons.json'),
        {
            filename: require.resolve('@iconify-json/mdi/icons.json'),
            icons: [
                'file-remove-outline',
                'translate',
                'vuetify',
                'information-variant',
                'arrow-top-right',
                'arrow-bottom-right',
                'arrow-bottom-left',
                'arrow-top-left',
                'arrow-collapse-all',
                'arrow-down-left',
                'web',
                'cpu-32-bit',
                'alpha-r',
                'alpha-g',
                'alpha-b',
                'map-marker-off-outline',
                'alpha-t-box-outline',
                'form-select',
                'account-cog-outline',
                'laptop',
            ],
        },
    ],
};
const component = '@iconify/vue';
const commonJS = false;
const target = (0, node_path_1.join)(__dirname, 'icons-bundle.js');
(async function () {
    let bundle = commonJS
        ? `const { addCollection } = require('${component}');\n\n`
        : `import { addCollection } from '${component}';\n\n`;
    const dir = (0, node_path_1.dirname)(target);
    try {
        await node_fs_1.promises.mkdir(dir, {
            recursive: true,
        });
    }
    catch (err) {
        //
    }
    if (sources.icons) {
        const sourcesJSON = sources.json ? sources.json : (sources.json = []);
        const organizedList = organizeIconsList(sources.icons);
        for (const prefix in organizedList) {
            const filename = require.resolve(`@iconify/json/json/${prefix}.json`);
            sourcesJSON.push({
                filename,
                icons: organizedList[prefix],
            });
        }
    }
    /**
     * Bundle JSON files
     */
    if (sources.json) {
        for (let i = 0; i < sources.json.length; i++) {
            const item = sources.json[i];
            // Load icon set
            const filename = typeof item === 'string' ? item : item.filename;
            let content = JSON.parse(await node_fs_1.promises.readFile(filename, 'utf8'));
            // Filter icons
            if (typeof item !== 'string' && item.icons?.length) {
                const filteredContent = (0, utils_1.getIcons)(content, item.icons);
                if (!filteredContent)
                    throw new Error(`Cannot find required icons in ${filename}`);
                content = filteredContent;
            }
            // Remove metadata and add to bundle
            removeMetaData(content);
            (0, utils_1.minifyIconSet)(content);
            bundle += `addCollection(${JSON.stringify(content)});\n`;
            console.log(`Bundled icons from ${filename}`);
        }
    }
    /**
     * Custom SVG
     */
    if (sources.svg) {
        for (let i = 0; i < sources.svg.length; i++) {
            const source = sources.svg[i];
            // Import icons
            const iconSet = await (0, tools_1.importDirectory)(source.dir, {
                prefix: source.prefix,
            });
            // Validate, clean up, fix palette and optimise
            await iconSet.forEach(async (name, type) => {
                if (type !== 'icon')
                    return;
                // Get SVG instance for parsing
                const svg = iconSet.toSVG(name);
                if (!svg) {
                    // Invalid icon
                    iconSet.remove(name);
                    return;
                }
                // Clean up and optimise icons
                try {
                    // Clean up icon code
                    await (0, tools_1.cleanupSVG)(svg);
                    if (source.monotone) {
                        // Replace color with currentColor, add if missing
                        // If icon is not monotone, remove this code
                        await (0, tools_1.parseColors)(svg, {
                            defaultColor: 'currentColor',
                            callback: (attr, colorStr, color) => {
                                return (!color || (0, tools_1.isEmptyColor)(color))
                                    ? colorStr
                                    : 'currentColor';
                            },
                        });
                    }
                    // Optimise
                    await (0, tools_1.runSVGO)(svg);
                }
                catch (err) {
                    // Invalid icon
                    console.error(`Error parsing ${name} from ${source.dir}:`, err);
                    iconSet.remove(name);
                    return;
                }
                // Update icon from SVG instance
                iconSet.fromSVG(name, svg);
            });
            console.log(`Bundled ${iconSet.count()} icons from ${source.dir}`);
            // Export to JSON
            const content = iconSet.export();
            bundle += `addCollection(${JSON.stringify(content)});\n`;
        }
    }
    // Save to file
    await node_fs_1.promises.writeFile(target, bundle, 'utf8');
    console.log(`Saved ${target} (${bundle.length} bytes)`);
})().catch(err => {
    console.error(err);
});
/**
 * Remove metadata from icon set
 */
function removeMetaData(iconSet) {
    const props = [
        'info',
        'chars',
        'categories',
        'themes',
        'prefixes',
        'suffixes',
    ];
    props.forEach(prop => {
        delete iconSet[prop];
    });
}
/**
 * Sort icon names by prefix
 */
function organizeIconsList(icons) {
    const sorted = Object.create(null);
    icons.forEach(icon => {
        const item = (0, utils_1.stringToIcon)(icon);
        if (!item)
            return;
        const prefix = item.prefix;
        const prefixList = sorted[prefix]
            ? sorted[prefix]
            : (sorted[prefix] = []);
        const name = item.name;
        if (!prefixList.includes(name))
            prefixList.push(name);
    });
    return sorted;
}
