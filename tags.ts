enum TagType {
    Paragraph,
    Header1,
    Header2,
    Header3,
    HorizontalRule
}

class TagTypeToHtml {
    private readonly tagType: Map<TagType, string> = new Map<TagType, string>();
    constructor() {
        this.tagType.set(TagType.Header1, "h1");
        this.tagType.set(TagType.Header2, "h2");
        this.tagType.set(TagType.Header3, "h3");
        this.tagType.set(TagType.Paragraph, "p");
        this.tagType.set(TagType.HorizontalRule, "hr");
    }

    public openingTag(tagType: TagType): string {
        return this.getTag(tagType, '<');
    }

    public closingTag(tagType: TagType): string {
        return this.getTag(tagType, '</');
    }

    private getTag(tagType: TagType, tagPrefix: string): string {
        let tag = this.tagType.get(tagType);
        if (tag !== null) {
            return '${tagPrefix}${tag}'
        }
        return '${tagPrefix}p>'
    }
}