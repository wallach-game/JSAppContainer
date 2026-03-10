import { Plugin, MarkdownPostProcessorContext } from "obsidian";
import { buildRendererHtml } from "./renderer";

const DEFAULT_HEIGHT = 400;

export default class OpenJSCADPlugin extends Plugin {
	async onload() {
		// Register code block processor for ```jscad blocks
		this.registerMarkdownCodeBlockProcessor(
			"jscad",
			(source, el, ctx) => this.processJscadBlock(source, el, ctx)
		);

		// Also support ```openjscad as an alias
		this.registerMarkdownCodeBlockProcessor(
			"openjscad",
			(source, el, ctx) => this.processJscadBlock(source, el, ctx)
		);

		console.log("OpenJSCAD Renderer plugin loaded");
	}

	onunload() {
		console.log("OpenJSCAD Renderer plugin unloaded");
	}

	private processJscadBlock(
		source: string,
		el: HTMLElement,
		_ctx: MarkdownPostProcessorContext
	): void {
		// Parse optional height from first line comment: // height: 500
		let height = DEFAULT_HEIGHT;
		const heightMatch = source.match(/^\/\/\s*height:\s*(\d+)/);
		if (heightMatch) {
			height = parseInt(heightMatch[1], 10);
		}

		// Create wrapper
		const wrapper = el.createDiv({ cls: "jscad-render-wrapper" });

		// Create iframe for sandboxed rendering
		const iframe = wrapper.createEl("iframe", {
			cls: "jscad-render-iframe",
			attr: {
				sandbox: "allow-scripts",
				frameborder: "0",
				width: "100%",
				height: `${height}px`,
			},
		});

		// Set the iframe content
		const html = buildRendererHtml(source, height);
		iframe.srcdoc = html;

		// Add a toggle to show/hide source code
		const sourceToggle = wrapper.createEl("details", {
			cls: "jscad-source-toggle",
		});
		sourceToggle.createEl("summary", { text: "View JSCAD Source" });
		const codeBlock = sourceToggle.createEl("pre");
		codeBlock.createEl("code", { text: source, cls: "language-javascript" });
	}
}
