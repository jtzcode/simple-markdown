export interface IMarkdownDocument {
    Add(...content: string[]): void;
    Get(): string;
}

export class MarkdownDocument implements IMarkdownDocument {
    private content: string = "";
    Add(...content: string[]): void {
        content.forEach(element => {
            this.content += element;
        });
    }

    Get(): string {
        return this.content;
    }
}

export class ParseElement {
    CurrentLine: string = "";
}