import { Directive, ElementRef, Input, OnInit, Optional } from '@angular/core';
import $ from './utils';
import { ConverterOptions } from './base-converter-options.provider';
import { BaseConverter, IConverterOptionsChangeable } from './base-converter.class';

let optionsProperties: string[] = [
    'disableForced4SpacesIndentedSublists', 'encodeEmails', 'excludeTrailingPunctuationFromURLs', 'ghCodeBlocks', 'ghCompatibleHeaderId', 'ghMentions', 'ghMentionsLink', 'headerLevelStart', 'literalMidWordUnderscores', 'noHeaderId', 'omitExtraWLInCodeBlocks', 'parseImgDimensions', 'prefixHeaderId', 'requireSpaceBeforeHeadingText', 'simpleLineBreaks', 'simplifiedAutoLink', 'smartIndentationFix', 'smoothLivePreview', 'strikethrough', 'tables', 'tablesHeaderId', 'tasklists', 'trimEachLine'
];

export enum MD_COMPONENT_TYPES {
    NONE,
    SRC,
    BINDING,
    CONTENT
}

export enum MD_COMPONENT_STATUSES {
    CREATED,
    INIT,
    PROCESSING,
    READY,
}

/**
 * @problem in content use <md>{}</md> - [unescaped "{":](https://github.com/angular/angular/issues/11859) the solution is to sanitize (html char code etc.).
 *
 * @example
 * ```javascript
 * import { NgModule } from '@angular/core';
 * import { MdDirective } from 'ng2-md';
 * @NgModule({
 *  declarations: [ MdDirective ];
 * })
 * export class AppModule{}
 * ```
 * ```javascript
 * import { IConverterOptionsChangeable } from 'ng2-md';
 * // ...
 * text: string = "...";
 * options: IConverterOptionsChangeable = {...};
 * // ...
 * ```
 * ```html
 * <md [value]="text"><md/>
 * ```
 * ```html
 * <div md="text"><div/>
 * ```
 * ```html
 * <md [value]="text" [options]="options"><md/>
 * ```
 * ```html
 * <md [value]="text" [disableForced4SpacesIndentedSublists]="options.disableForced4SpacesIndentedSublists" [encodeEmails]="options.encodeEmails" [excludeTrailingPunctuationFromURLs]="options.excludeTrailingPunctuationFromURLs" [ghCodeBlocks]="options.ghCodeBlocks" [ghCompatibleHeaderId]="options.ghCompatibleHeaderId" [ghMentions]="options.ghMentions" [ghMentionsLink]="options.ghMentionsLink" [headerLevelStart]="options.headerLevelStart" [literalMidWordUnderscores]="options.literalMidWordUnderscores" [noHeaderId]="options.noHeaderId" [omitExtraWLInCodeBlocks]="options.omitExtraWLInCodeBlocks" [parseImgDimensions]="options.parseImgDimensions" [prefixHeaderId]="options.prefixHeaderId" [requireSpaceBeforeHeadingText]="options.requireSpaceBeforeHeadingText" [simpleLineBreaks]="options.simpleLineBreaks" [simplifiedAutoLink]="options.simplifiedAutoLink" [smartIndentationFix]="options.smartIndentationFix" [smoothLivePreview]="options.smoothLivePreview" [strikethrough]="options.strikethrough" [tables]="options.tables" [tablesHeaderId]="options.tablesHeaderId" [tasklists]="options.tasklists" [trimEachLine]="options.trimEachLine"></md>
 * ```
 * ```html
 * <md trimEachLine="space"> # abc </md> // <md><h1>abc</h1></md>
 * ```
 * ```html
 * <md trimEachLine="tab">\t# abc\t</md> // <md><h1>abc</h1></md>
 * ```
 * both tab and space
 * ```html
 * <md trimEachLine>\t # abc\t </md> // <md><h1>abc</h1></md>
 * ```
 */
@Directive({
    selector: 'md,[md]',
    inputs: [].concat(optionsProperties)
})
export class MdDirective extends BaseConverter implements OnInit {

    public static readonly TYPES = MD_COMPONENT_TYPES;
    public static readonly STATUSES = MD_COMPONENT_STATUSES;

    // options getter setter dynamic definition (the code after the class)
    public disableForced4SpacesIndentedSublists?: boolean;
    public encodeEmails?: boolean;
    public excludeTrailingPunctuationFromURLs?: boolean;
    public ghCodeBlocks?: boolean;
    public ghCompatibleHeaderId?: boolean;
    public ghMentions?: boolean;
    public ghMentionsLink?: string;
    public headerLevelStart?: number;
    public literalMidWordUnderscores?: boolean;
    public noHeaderId?: boolean;
    public omitExtraWLInCodeBlocks?: boolean;
    public parseImgDimensions?: boolean;
    public prefixHeaderId?: string | boolean;
    public requireSpaceBeforeHeadingText?: boolean;
    public simpleLineBreaks?: boolean;
    public simplifiedAutoLink?: boolean;
    public smartIndentationFix?: boolean;
    public smoothLivePreview?: boolean;
    public strikethrough?: boolean;
    public tables?: boolean;
    public tablesHeaderId?: boolean;
    public tasklists?: boolean;
    public trimEachLine?: boolean | 'tab' | 'space';

    private _value: string;
    private _type: number = MdDirective.TYPES.NONE;
    private _status: number = MdDirective.STATUSES.CREATED;

    /** Value of the component (the input md text pre converter). */
    @Input()
    public get value(): string {
        return this._value;
    }

    public set value(value: string) {
        this.setValue(value);
    }

    /** Type of the input source [binding, content, src]. */
    public get type(): string {
        return MdDirective.TYPES[this._type].toLowerCase();
    }

    /** Status of the component life cycle. */
    public get status(): string {
        return MdDirective.STATUSES[this._status].toLowerCase();
    }

    /** Alias to value */
    @Input()
    public get md(): string {
        return this.value;
    }

    public set md(value: string) {
        this.value = value;
    }

    @Input()
    public get options(): IConverterOptionsChangeable {
        return this.getOptions();
    }

    public set options(options: IConverterOptionsChangeable) {
        this.setOptions(options);
    }

    constructor(private _elementRef: ElementRef, @Optional() options?: ConverterOptions) {
        super(options);

        // override the setOption method (define in the super constructor)
        this.setOption = (optionKey: string, value: any) => {
            this.getOptions()[optionKey] = value;
            this._onChange();
        };
    }

    public ngOnInit(): void {

        if (this._type === MdDirective.TYPES.NONE && !$.isEmpty(this._elementRef.nativeElement.innerText)) {
            let value = this._elementRef.nativeElement.innerHTML;
            this.setValue(value, MdDirective.TYPES.CONTENT);
        }

        if (this._status === MdDirective.STATUSES.CREATED) {
            this._status = MdDirective.STATUSES.INIT;
        }

    }

    public setValue(value: string, type: number = MdDirective.TYPES.BINDING): void {
        this._value = value;
        this._type = type;
        this._onChange();
    }

    public setOptions(options: IConverterOptionsChangeable): void {
        super.setOptions(options);
        this._onChange();
    }

    public compile(): void {
        if (this._type === MdDirective.TYPES.NONE) return;
        this._status = MdDirective.STATUSES.PROCESSING;
        this._elementRef.nativeElement.innerHTML = this.toHTML();
        this._status = MdDirective.STATUSES.READY;
    }

    public registerOnChange(fn: (() => void)): void {
        if (!$.isFunction(fn)) throw new Error('Arg fn is missing or invalid.');
        this._onChange = fn;
    }

    /** Converter the component (md value) to html */
    public toHTML(): string {
        let {_value: value} = this;
        return this.makeHtml(value);
    }

    /** Default OnChange method, Called on change value or options */
    private _onChange: (() => void) = (): void => {
        this.compile();
    }

}

// define options properties getter setter for angular directive and direct access
optionsProperties.forEach((key: string) => {
    Object.defineProperty(MdDirective.prototype, key, {
        set(value: any): void {
            this.setOption(key, $.isEmpty(value) ? true : value);
        },
        get(): any {
            return this.getOption(key);
        },
        enumerable: true,
        configurable: true
    });
});