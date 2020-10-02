import { IMarkdownDocument, ParseElement } from "./markdown-doc";
import { LineParser } from "./parser";
import { Header1Visitor, Header2Visitor, Header3Visitor, HorizontalRuleVisitor, IVisitable, IVisitor, ParagraphVisitor, Visitable } from "./visitor";

abstract class Handler<T> {
    protected next: Handler<T> | null = null;
    public SetNext(next: Handler<T>): void {
        this.next = next;
    }
    public HandleRequest(request: T): void {
        if (this.CanHandle(request)) {
            if (this.next !== null) {
                this.next.HandleRequest(request);
            }
            return;
        }
    }
    //This method will try to handle the request, if cannot, will pass to next handler.
    //The implementation may be different for various handlers. Thus abstract.
    protected abstract CanHandle(request: T): boolean;
}

export class ParseChainHandler extends Handler<ParseElement> {
    private readonly visitable: IVisitable = new Visitable();
    constructor(private readonly document: IMarkdownDocument,
                private readonly tagType: string,
                private readonly visitor: IVisitor) {
        super();
    }
    protected CanHandle(request: ParseElement): boolean {
        let split =  new LineParser().Parse(request.CurrentLine, this.tagType);
        if (split[0]) {
            request.CurrentLine = split[1];
            this.visitable.Accept(this.visitor, request, this.document);
        }
        return split[0];
    }
}

export class ParagraphHandler extends Handler<ParseElement> {
    private readonly visitable: IVisitable = new Visitable();
    private readonly visitor: IVisitor = new ParagraphVisitor();
    protected CanHandle(request: ParseElement): boolean {
        this.visitable.Accept(this.visitor, request, this.document);
        return true;
    }
    constructor(private readonly document: IMarkdownDocument) {
        super();
    }
}

export class Header1ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "#", new Header1Visitor());
    }
}

export class Header2ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "##", new Header2Visitor());
    }
}

export class Header3ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "###", new Header3Visitor());
    }
}

export class HorizontalRuleChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "---", new HorizontalRuleVisitor());
    }
}