import { ParseElement, IMarkdownDocument, MarkdownDocument } from "./markdown-doc";

export interface IVisitor {
    Visit(token: ParseElement, markdownDoc: IMarkdownDocument): void;
}

export interface IVisitable {
    Accept(visitor: IVisitor, token: ParseElement, markdownDoc: IMarkdownDocument): void;
}

abstract class VisitorBase implements IVisitor {
    constructor(private readonly tagType: TagType, private readonly tagTypeToHtml: TagTypeToHtml) {}

    Visit(token: ParseElement, markdownDoc: IMarkdownDocument): void {
        markdownDoc.Add(this.tagTypeToHtml.openingTag(this.tagType), token.CurrentLine, 
            this.tagTypeToHtml.closingTag(this.tagType));
    }
}

class Header1Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header1, new TagTypeToHtml());
    }
}

class Header2Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header2, new TagTypeToHtml());
    }
}

class Header3Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header3, new TagTypeToHtml());
    }
}

class ParagraphVisitor extends VisitorBase {
    constructor() {
        super(TagType.Paragraph, new TagTypeToHtml());
    }
}

class HorizontalRuleVisitor extends VisitorBase {
    constructor() {
        super(TagType.HorizontalRule, new TagTypeToHtml());
    }
}

//这里“访问”的意思是：使用某个标签到MD文档中
export class Visitable implements IVisitable {
    Accept(visitor: IVisitor, token: ParseElement, markdownDoc: IMarkdownDocument): void {
        visitor.Visit(token, markdownDoc);
    }
}