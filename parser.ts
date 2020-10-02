import { Header1ChainHandler, Header2ChainHandler, Header3ChainHandler, HorizontalRuleChainHandler, ParagraphHandler, ParseChainHandler } from "./handler";
import { IMarkdownDocument, MarkdownDocument, ParseElement } from "./markdown-doc";

class HtmlHandler {
    private markdownChange: MarkDown = new MarkDown();
    public TextChangeHandler (id: string, outputId: string): void {
        let markdown = <HTMLTextAreaElement>document.getElementById(id);
        let markdownOutput = <HTMLLabelElement>document.getElementById(outputId);
        if (markdown !== null) {
            markdown.onkeyup = (e) => {
                this.Render(markdown, markdownOutput);
            }
            window.onload = (e: any) => {
                this.Render(markdown, markdownOutput);
            }
        }
    }

    private Render(markdown: HTMLTextAreaElement, markdownOutput: HTMLLabelElement) {
        if (markdown.value) {
            markdownOutput.innerHTML = this.markdownChange.ToHtml(markdown.value);
        } else {
            markdownOutput.innerHTML = "<p></p>"
        }
    }
}

export class LineParser {
    public Parse(value: string, tag: string): [boolean, string] {
        let output: [boolean, string] = [false, ""];
        output[1] = value;
        if (value === "") {
            return output;
        }
        let split = value.startsWith('${tag}');
        if (split) {
            output[0] = true;
            output[1] = value.substr(tag.length);
        }
        return output;
    }
}

class ResponsibilityChainFactory {
    Build(document: IMarkdownDocument): ParseChainHandler {
        let header1: Header1ChainHandler = new Header1ChainHandler(document);
        let header2: Header1ChainHandler = new Header2ChainHandler(document);
        let header3: Header1ChainHandler = new Header3ChainHandler(document);
        let horizontalRule: HorizontalRuleChainHandler = new HorizontalRuleChainHandler(document);
        let paragraph: ParagraphHandler = new ParagraphHandler(document);

        header1.SetNext(header2);
        header2.SetNext(header3);
        header3.SetNext(horizontalRule);
        horizontalRule.SetNext(paragraph);

        return header1;
    }
}

class MarkDown {
    public ToHtml(text: string): string {
        let document: IMarkdownDocument = new MarkdownDocument();
        let header1: Header1ChainHandler = new ResponsibilityChainFactory().Build(document);
        let lines: string[] = text.split('\n');
        for (let index = 0; index < lines.length; index++) {
            let parseElement: ParseElement = new ParseElement();
            parseElement.CurrentLine = lines[index];
            header1.HandleRequest(parseElement);
        }
        return document.Get();
    }
}