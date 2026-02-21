import React, { useMemo } from 'react';
import logo from '../assets/logo.png';

export const TemplateRenderer = ({ templateId, data }) => {
    // We'll load the CSS and HTML as modules if Vite supports it, 
    // or just use raw strings for now for maximum reliability.

    // Note: In a production app, we might use a context or a more robust loading mechanism.
    // For now, we'll embed the CSS directly to ensure it works across all templates.
    const commonCSS = `
    :root {
      --primary: #6366f1;
      --text-main: #0a0c10;
      --text-muted: #64748b;
      --border-color: #e2e8f0;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 15mm 20mm;
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: var(--text-main);
    }
    /* Rest of common styles will be injected */
  `;

    // Simple string replacement for Handlebars style placeholders
    const renderTemplate = (html, templateData) => {
        let output = html;

        // Replace Logo
        output = output.replace(/src="[^"]*l1s-logo\.png"/g, `src="${logo}"`);

        // Simple Handlebars replacement
        const replaceRecursive = (obj, prefix = '') => {
            for (const key in obj) {
                const value = obj[key];
                const path = prefix ? `${prefix}.${key}` : key;

                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    replaceRecursive(value, path);
                } else if (Array.isArray(value)) {
                    // Handle arrays (very simplistic for now)
                    // Look for {{#each path}}...{{/each}}
                    const regex = new RegExp(`{{#each ${path}}}([\\s\\S]*?){{/each}}`, 'g');
                    output = output.replace(regex, (_, inner) => {
                        return value.map(item => {
                            let itemHtml = inner;
                            for (const itemKey in item) {
                                itemHtml = itemHtml.replace(new RegExp(`{{${itemKey}}}`, 'g'), item[itemKey]);
                            }
                            return itemHtml;
                        }).join('');
                    });
                } else {
                    output = output.replace(new RegExp(`{{${path}}}`, 'g'), value);
                    // Handle triple braces for HTML
                    output = output.replace(new RegExp(`{{{${path}}}}`, 'g'), value);
                }
            }
        };

        replaceRecursive(templateData);

        // Clean up any remaining placeholders
        output = output.replace(/{{[\s\S]*?}}/g, '');

        return output;
    };

    // We need to fetch the HTML content. Since this is a specialized component,
    // we'll assume the HTML strings are passed in or we use a map.
    // For the demo, I'll use a dynamic import approach or simplified strings.

    return (
        <div className="template-outer">
            <div dangerouslySetInnerHTML={{ __html: data.html }} />
        </div>
    );
};
