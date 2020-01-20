import { IfGroupOptions, IfCollectionsOptions, BasicOptions } from './../types/options.type';
import { IfConfigs } from '../types/configs.type';

export class ElementBase {
    public key: string;
    public idx: number;
    public parent: any;
    public configs: IfConfigs;

    constructor(options: BasicOptions) {
        this.key = options.key;
        this.idx = options.idx;
        this.configs = options.configs || {};
    }

    public setParent(parent: any): void {
        this.parent = parent;
    }
}

export class ElementsBase extends ElementBase {
    public elements: any[];

    constructor(options: IfGroupOptions<any> | IfCollectionsOptions) {
        super(options);
        this.elements = options.elements;
    }

    protected sortElements(): void {
        this.elements.sort((a, b) => a.idx - b.idx);
    }

    protected setElementsParent(parent: any): void {
        this.elements.forEach(elem => elem.setParent(parent));
    }
}
