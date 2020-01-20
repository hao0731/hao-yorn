import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

import { FormElement } from './element.model';
import { FormElementGroup } from './group.model';
import { FormElementCollection } from './collection.model';

import { IfRelation } from '../types/configs.type';
import { IfFrameOptions } from '../types/options.type';
import { RelationMethod } from '../types/params.type';

export class FormFrame {

    private relation$: Subject<any> = new Subject();
    private relationList: IfRelation[] = [];
    private preValues: any;

    public form: FormGroup;
    public elements: Array<FormElement<any> | FormElementGroup<any> | FormElementCollection>;
    public relationChanges: Observable<any> = this.relation$.asObservable();

    private changeEnd$: Subject<boolean> = new Subject();

    constructor(options: IfFrameOptions) {
        this.elements = options.elements;
        this.sortElements();
        this.setElementsParent();
        this.form = new FormGroup(this.getFields());
        this.preValues = this.form.getRawValue();
        options.detect = options.detect === undefined ? true : options.detect;
        if ( options.detect ) {
            this.launchDetection();
        }
    }

    // =====================================================================================
    // @ Public Methods
    // =====================================================================================

    /**
     * Input data in order to change relation value.
     * @param values Enter form rawValues
     */
    public changeRelationValue(values: any): void {
        this.relationList.forEach(relation => {
            const { base, targets, method, conditionFunc } = relation;
            switch ( method ) {
                case RelationMethod.DISABLED:
                    this.doDisabled(targets, conditionFunc());
                    break;
                case RelationMethod.HIDDEN:
                    this.doHidden(targets, conditionFunc());
                    break;
                default:
                    if ( conditionFunc() ) {
                        this.doDataBinding(method, values, base, targets);
                    }
            }
        });
        this.preValues = values;
        this.relation$.next(values);
    }

    /**
     * Set fields of relation.
     * @param list Enter fields of relation params
     */
    public setFieldRelations(list: IfRelation[]): void {
        list.forEach(relation => {
            if ( !relation.conditionFunc ) {
                relation.conditionFunc = () => {
                    return true;
                };
            }
        });
        this.relationList = [...list];
        this.changeRelationValue(this.form.getRawValue());
    }

    /**
     * call this method when component destroyed.
     */
    public destroy(): void {
        this.changeEnd$.next(true);
        this.changeEnd$.complete();
    }

    // =====================================================================================
    // @ Private Methods - Elements
    // =====================================================================================

    /**
     * Use elements to create FormGroup params
     */
    private getFields(): any {
        const universal = {};
        this.elements.forEach(model => {
            if ( model instanceof FormElement ) {
                const { key, value, configs } = (model as FormElement<any>);
                universal[key] = new FormControl(
                    { value, disabled: configs && configs.disabled },
                    model.getValidations()
                );
            }
            if ( model instanceof FormElementGroup ) {
                const { key } = (model as FormElementGroup<any>);
                universal[key] = new FormArray([]);
                (model as FormElementGroup<any>).elements.forEach(elem => {
                    universal[key].push(
                        new FormControl(
                            { value: elem.value, disabled: elem.configs && elem.configs.disabled },
                            elem.getValidations()
                        )
                    );
                });
            }
            if ( model instanceof FormElementCollection ) {
                const { key } = (model as FormElementCollection);
                const collection: any = {};
                model.elements.forEach(elem => {
                    if ( elem instanceof FormElement ) {
                        collection[elem.key] = new FormControl(
                            { value: elem.value, disabled: elem.configs && elem.configs.disabled },
                            elem.getValidations()
                        );
                    }
                    if ( elem instanceof FormElementGroup ) {
                        collection[elem.key] = new FormArray([]);
                        elem.elements.forEach(control => {
                            collection[elem.key].push(
                                new FormControl(
                                    { value: control.value, disabled: control.configs && control.configs.disabled },
                                    control.getValidations()
                                )
                            );
                        });
                    }
                });
                universal[key] = new FormGroup(collection);
            }
        });
        return universal;
    }

    private sortElements(): void {
        this.elements.sort((a, b) => a.idx - b.idx);
    }

    private setElementsParent(): void {
        this.elements.forEach(elem => elem.setParent(this));
    }

    // =====================================================================================
    // @ Private Methods - Relation
    // =====================================================================================

    /**
     * Match binding method.
     * @param method the field of relation method.
     * @param values form rawValues.
     * @param base the base element's path.
     * @param targets the target elements' path.
     */
    private doDataBinding(method: RelationMethod, values: any, base: string[], targets: string[][]): void {
        const baseModel = this.findElement(base);
        const targetModels = targets.map(target => this.findElement(target));
        const baseMap = this.getModelMap(baseModel);
        const targetMaps = targetModels.map(target => this.getModelMap(target));
        const baseVal = _.get(values, baseMap);
        const preBaseVal = _.get(this.preValues, baseMap);

        switch ( method ) {
            case RelationMethod.ONE_WAY_BINDING:
                this.doOneWayBinding(values, { baseModel, targetModels, targetMaps, baseVal, preBaseVal });
                break;
            case RelationMethod.TWO_WAY_BINDING:
                this.doTwoWayBinding(values, { baseModel, targetModels, baseMap, targetMaps, baseVal, preBaseVal });
                break;
        }
    }

    /**
     * Let targets' value be based on base's value.
     * @param values form rawValues.
     * @param info include baseModel, targetModels, targetMaps, baseVal, preBaseVal.
     */
    private doOneWayBinding(values: any, info: any): void {
        const { baseModel, targetModels, targetMaps, baseVal, preBaseVal } = info;
        if ( !_.isEqual(baseVal, preBaseVal) ) {
            baseModel.value = baseVal;
            targetMaps.forEach((m, idx) => {
                let newValue = baseVal;
                if ( baseModel instanceof FormElementCollection && targetModels[idx] instanceof FormElementCollection ) {
                    newValue = this.exceptFilter(_.get(values, m), baseVal);
                }
                _.set(values, m, newValue);
                targetModels[idx].value = newValue;
            });
        }
    }

    /**
     * Sync targets' value and base's value
     * @param values form rawValues.
     * @param info include baseModel, baseMap, targetModels, targetMaps, baseVal, preBaseVal.
     */
    private doTwoWayBinding(values: any, info: any): void {
        const { baseModel, targetModels, baseMap, targetMaps, baseVal, preBaseVal } = info;
        if ( !_.isEqual(baseVal, preBaseVal) ) {
            this.doOneWayBinding(values, info);
        } else {
            const changeTargetIdx = targetMaps.findIndex(m => !_.isEqual(_.get(values, m), _.get(this.preValues, m)));
            if ( changeTargetIdx === -1 ) { return; }

            const val = _.get(values, targetMaps[changeTargetIdx]);
            const isCollectionTarget = targetModels[changeTargetIdx] instanceof FormElementCollection;

            let newValue = val;
            if ( baseModel instanceof FormElementCollection && isCollectionTarget ) {
                newValue = this.exceptFilter(baseVal, val);
            }

            _.set(values, baseMap, newValue);

            targetMaps.forEach((m: any, idx: number) => {
                if ( changeTargetIdx === idx ) { return; }
                newValue = val;
                if ( targetModels[idx] instanceof FormElementCollection && isCollectionTarget ) {
                    newValue = this.exceptFilter(_.get(values, m), val);
                }
                _.set(values, baseMap, newValue);
                targetModels[idx].value = newValue;
            });
        }
    }

    /**
     * disble targets.
     * @param targets the target elements' path.
     * @param condition disabled condition.
     */
    private doDisabled(targets: string[][], condition: boolean): void {
        const targetModels = targets.map(target => this.findElement(target));
        const targetMaps = targetModels.map(target => this.getModelMap(target));
        if ( condition ) {
            targetMaps.forEach((m, idx) => {
                this.form.get(m).disable({ emitEvent: false });
                targetModels[idx].configs.disabled = true;
            });
        } else {
            targetMaps.forEach((m, idx) => {
                this.form.get(m).enable({ emitEvent: false });
                targetModels[idx].configs.disabled = false;
            });
        }
    }

    /**
     * hidden targets.
     * @param targets the target elements' path.
     * @param condition hidden condition.
     */
    private doHidden(targets: string[][], condition: boolean): void {
        const targetModels = targets.map(target => this.findElement(target));
        targetModels.forEach(model => {
            model.configs.hidden = Boolean(condition);
        });
    }

    /**
     * auto change relation fields' value.
     */
    private launchDetection(): void {
        this.form.valueChanges.pipe(
            takeUntil(this.changeEnd$)
        ).subscribe(() => this.changeRelationValue(this.form.getRawValue()));

        this.relationChanges.pipe(
            takeUntil(this.changeEnd$)
        ).subscribe(values => this.form.setValue(values, { emitEvent: false }));
    }

    // =====================================================================================
    // @ Private Methods - Handler
    // =====================================================================================

    /**
     * find specific element.
     * @param keys the path of elements.
     */
    private findElement(keys: string[]): any {
        keys = [...keys];
        const firstKey = keys.shift();
        let model = this.elements.find(x => x.key === firstKey);
        for ( const key of keys ) {
            if ( model instanceof FormElement ) {
                break;
            } else if ( model instanceof FormElementCollection || model instanceof FormElementGroup ) {
                model = model.elements.find(x => x.key === key);
            }
        }
        return model;
    }

    /**
     * Get specific element model's map.
     * @param model element model.
     * @param isFull get path containing array index.
     */
    private getModelMap(model: any, isFull = false): any[] {
        let parent = model.parent;
        const map = [];
        map.push(model.key);
        while ( !(parent instanceof FormFrame) ) {
            if ( parent instanceof FormElementGroup ) {
                const idx = parent.elements.findIndex(x => x.key === model.key);
                map.push(idx, parent.key);
                if ( !isFull ) {
                    map.shift();
                }
            } else if ( parent instanceof FormElementCollection ) {
                map.push(parent.key);
            }
            parent = parent.parent;
        }
        map.reverse();
        return map;
    }

    /**
     * Let the fields in origin value refer to the values of the same fields in ref value.
     * @param origin origin value.
     * @param ref Reference value.
     */
    private exceptFilter(origin: any, ref: any): any {
        const originLen = Object.keys(origin).length;
        const refLen = Object.keys(ref).length;
        const result = {};

        if ( originLen < refLen ) {
            Object.keys(origin).forEach(key => {
                result[key] = ref[key];
            });
        } else {
            Object.assign(result, origin, ref);
        }

        return result;
    }

}
