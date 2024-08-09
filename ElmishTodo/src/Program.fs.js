import { indexed, ofArray, singleton, append, filter, item as item_7, isEmpty, empty, cons, head as head_2, tail as tail_2 } from "../fable_modules/fable-library-js.4.19.3/List.js";
import { Record, Union } from "../fable_modules/fable-library-js.4.19.3/Types.js";
import { int32_type, list_type, record_type, union_type, string_type } from "../fable_modules/fable-library-js.4.19.3/Reflection.js";
import { createObj, equals } from "../fable_modules/fable-library-js.4.19.3/Util.js";
import { createElement } from "react";
import { join } from "../fable_modules/fable-library-js.4.19.3/String.js";
import { reactApi } from "../fable_modules/Feliz.2.8.0/./Interop.fs.js";
import { collect, singleton as singleton_1, append as append_1, delay, toList } from "../fable_modules/fable-library-js.4.19.3/Seq.js";
import { ProgramModule_mkSimple, ProgramModule_run } from "../fable_modules/Fable.Elmish.4.2.0/program.fs.js";
import { Program_withReactSynchronous } from "../fable_modules/Fable.Elmish.React.4.0.0/react.fs.js";

export function remElem(index, lst) {
    let matchResult;
    if (index < 0) {
        matchResult = 0;
    }
    else if (index === 0) {
        if (!isEmpty(lst)) {
            matchResult = 1;
        }
        else {
            matchResult = 3;
        }
    }
    else if (!isEmpty(lst)) {
        matchResult = 2;
    }
    else {
        matchResult = 3;
    }
    switch (matchResult) {
        case 0:
            return lst;
        case 1:
            return tail_2(lst);
        case 2:
            return cons(head_2(lst), remElem(index - 1, tail_2(lst)));
        default:
            return empty();
    }
}

export function repElem(elem, index, lst) {
    let matchResult;
    if (index < 0) {
        matchResult = 0;
    }
    else if (index === 0) {
        if (!isEmpty(lst)) {
            matchResult = 1;
        }
        else {
            matchResult = 3;
        }
    }
    else if (!isEmpty(lst)) {
        matchResult = 2;
    }
    else {
        matchResult = 3;
    }
    switch (matchResult) {
        case 0:
            return lst;
        case 1:
            return cons(elem, tail_2(lst));
        case 2:
            return cons(head_2(lst), repElem(elem, index - 1, tail_2(lst)));
        default:
            return empty();
    }
}

export function applyAt(fn, index, lst) {
    let matchResult;
    if (index < 0) {
        matchResult = 0;
    }
    else if (index === 0) {
        if (!isEmpty(lst)) {
            matchResult = 1;
        }
        else {
            matchResult = 3;
        }
    }
    else if (!isEmpty(lst)) {
        matchResult = 2;
    }
    else {
        matchResult = 3;
    }
    switch (matchResult) {
        case 0:
            return lst;
        case 1:
            return cons(fn(head_2(lst)), tail_2(lst));
        case 2:
            return cons(head_2(lst), applyAt(fn, index - 1, tail_2(lst)));
        default:
            return empty();
    }
}

export class ItemState extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["None", "Finished", "Editing"];
    }
}

export function ItemState_$reflection() {
    return union_type("App.ItemState", [], ItemState, () => [[], [], [["NewText", string_type]]]);
}

export class Item extends Record {
    constructor(Text$, ItemState) {
        super();
        this.Text = Text$;
        this.ItemState = ItemState;
    }
}

export function Item_$reflection() {
    return record_type("App.Item", [], Item, () => [["Text", string_type], ["ItemState", ItemState_$reflection()]]);
}

export class State extends Record {
    constructor(Items, Active) {
        super();
        this.Items = Items;
        this.Active = Active;
    }
}

export function State_$reflection() {
    return record_type("App.State", [], State, () => [["Items", list_type(Item_$reflection())], ["Active", string_type]]);
}

export function init() {
    return new State(empty(), "");
}

export class Msg extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Commit", "Delete", "TextChange", "ToggleFinish", "DeleteFinished", "StartEdit", "EditEdit", "CommitEdit", "CancelEdit"];
    }
}

export function Msg_$reflection() {
    return union_type("App.Msg", [], Msg, () => [[], [["index", int32_type]], [["text", string_type]], [["index", int32_type]], [], [["index", int32_type]], [["index", int32_type], ["text", string_type]], [["index", int32_type]], [["index", int32_type]]]);
}

export function update(msg, state) {
    switch (msg.tag) {
        case 1:
            return new State(remElem(msg.fields[0], state.Items), state.Active);
        case 2:
            return new State(state.Items, msg.fields[0]);
        case 3: {
            const index_1 = msg.fields[0] | 0;
            const matchValue = item_7(index_1, state.Items).ItemState;
            switch (matchValue.tag) {
                case 1:
                    return new State(applyAt((item) => (new Item(item.Text, new ItemState(0, []))), index_1, state.Items), state.Active);
                case 0:
                    return new State(applyAt((item_1) => (new Item(item_1.Text, new ItemState(1, []))), index_1, state.Items), state.Active);
                default:
                    return state;
            }
        }
        case 4:
            return new State(filter((item_2) => !equals(item_2.ItemState, new ItemState(1, [])), state.Items), state.Active);
        case 5: {
            const index_2 = msg.fields[0] | 0;
            const matchValue_1 = item_7(index_2, state.Items);
            if (matchValue_1.ItemState.tag === 0) {
                return new State(applyAt((item_3) => (new Item(item_3.Text, new ItemState(2, [matchValue_1.Text]))), index_2, state.Items), state.Active);
            }
            else {
                return state;
            }
        }
        case 6:
            return new State(applyAt((item_4) => (new Item(item_4.Text, new ItemState(2, [msg.fields[1]]))), msg.fields[0], state.Items), state.Active);
        case 7: {
            const index_4 = msg.fields[0] | 0;
            const matchValue_2 = item_7(index_4, state.Items).ItemState;
            if (matchValue_2.tag === 2) {
                return new State(applyAt((item_5) => (new Item(matchValue_2.fields[0], new ItemState(0, []))), index_4, state.Items), state.Active);
            }
            else {
                return state;
            }
        }
        case 8: {
            const index_5 = msg.fields[0] | 0;
            if (item_7(index_5, state.Items).ItemState.tag === 2) {
                return new State(applyAt((item_6) => (new Item(item_6.Text, new ItemState(0, []))), index_5, state.Items), state.Active);
            }
            else {
                return state;
            }
        }
        default:
            return new State(append(state.Items, singleton(new Item(state.Active, new ItemState(0, [])))), "");
    }
}

export function inputField(active, dispatch) {
    let elems_1, elems;
    return createElement("div", createObj(ofArray([["className", join(" ", ["field", "has-addons"])], (elems_1 = [createElement("input", {
        className: join(" ", ["input", "is-medium"]),
        type: "text",
        placeholder: "TODO",
        value: active,
        onChange: (ev) => {
            dispatch(new Msg(2, [ev.target.value]));
        },
    }), createElement("button", createObj(ofArray([["className", join(" ", ["button", "is-info", "is-outlined"])], ["onClick", (_arg) => {
        dispatch(new Msg(0, []));
    }], ["disabled", "" === active], (elems = [createElement("i", {
        className: join(" ", ["fa", "fa-plus"]),
    })], ["children", reactApi.Children.toArray(Array.from(elems))])])))], ["children", reactApi.Children.toArray(Array.from(elems_1))])])));
}

export function editButton(index, dispatch) {
    let elems;
    return createElement("button", createObj(ofArray([["className", join(" ", ["button"])], ["onClick", (_arg) => {
        dispatch(new Msg(5, [index]));
    }], (elems = [createElement("i", {
        className: join(" ", ["fa", "fa-edit"]),
    })], ["children", reactApi.Children.toArray(Array.from(elems))])])));
}

export function finishButton(finished, index, dispatch) {
    let elems;
    return createElement("button", createObj(ofArray([["className", join(" ", ["button"])], ["onClick", (_arg) => {
        dispatch(new Msg(3, [index]));
    }], (elems = [createElement("i", {
        className: join(" ", ["fa", "fa-check"]),
    })], ["children", reactApi.Children.toArray(Array.from(elems))])])));
}

export function deleteButton(index, dispatch) {
    let elems;
    return createElement("button", createObj(ofArray([["className", join(" ", ["button"])], ["onClick", (_arg) => {
        dispatch(new Msg(1, [index]));
    }], (elems = [createElement("i", {
        className: join(" ", ["fa", "fa-minus"]),
    })], ["children", reactApi.Children.toArray(Array.from(elems))])])));
}

export function cancelButton(index, dispatch) {
    let elems;
    return createElement("button", createObj(ofArray([["className", join(" ", ["button"])], ["onClick", (_arg) => {
        dispatch(new Msg(8, [index]));
    }], (elems = [createElement("i", {
        className: join(" ", ["fa", "fa-circle-xmark"]),
    })], ["children", reactApi.Children.toArray(Array.from(elems))])])));
}

export function commitButton(index, dispatch) {
    let elems;
    return createElement("button", createObj(ofArray([["className", join(" ", ["button"])], ["onClick", (_arg) => {
        dispatch(new Msg(7, [index]));
    }], (elems = [createElement("i", {
        className: join(" ", ["fa", "fa-check"]),
    })], ["children", reactApi.Children.toArray(Array.from(elems))])])));
}

export function itemRow(item, index, dispatch) {
    let elems;
    return createElement("div", createObj(ofArray([["className", join(" ", ["field", "has-addons"])], (elems = toList(delay(() => {
        const matchValue = item.ItemState;
        return (matchValue.tag === 1) ? append_1(singleton_1(deleteButton(index, dispatch)), delay(() => append_1(singleton_1(finishButton(true, index, dispatch)), delay(() => {
            let children;
            return singleton_1((children = singleton(createElement("b", {
                children: [item.Text],
            })), createElement("s", {
                children: reactApi.Children.toArray(Array.from(children)),
            })));
        })))) : ((matchValue.tag === 2) ? append_1(singleton_1(commitButton(index, dispatch)), delay(() => append_1(singleton_1(cancelButton(index, dispatch)), delay(() => singleton_1(createElement("input", {
            className: join(" ", ["input"]),
            value: matchValue.fields[0],
            onChange: (ev) => {
                dispatch(new Msg(6, [index, ev.target.value]));
            },
        })))))) : append_1(singleton_1(deleteButton(index, dispatch)), delay(() => append_1(singleton_1(finishButton(false, index, dispatch)), delay(() => append_1(singleton_1(editButton(index, dispatch)), delay(() => singleton_1(createElement("p", {
            children: [item.Text],
        })))))))));
    })), ["children", reactApi.Children.toArray(Array.from(elems))])])));
}

export function itemList(items, dispatch) {
    const children_2 = toList(delay(() => collect((matchValue) => {
        let children;
        return singleton_1((children = singleton(itemRow(matchValue[1], matchValue[0], dispatch)), createElement("li", {
            children: reactApi.Children.toArray(Array.from(children)),
        })));
    }, indexed(items))));
    return createElement("ul", {
        children: reactApi.Children.toArray(Array.from(children_2)),
    });
}

export function clearButton(state, dispatch) {
    let elems;
    return createElement("div", createObj(ofArray([["className", join(" ", ["field"])], (elems = [createElement("button", {
        className: join(" ", ["button"]),
        children: "Clear Finished",
        onClick: (_arg) => {
            dispatch(new Msg(4, []));
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems))])])));
}

export function render(state, dispatch) {
    let elems_1, elems;
    return createElement("div", createObj(ofArray([["className", join(" ", [])], (elems_1 = [createElement("div", createObj(ofArray([["className", join(" ", [])], (elems = [inputField(state.Active, dispatch), itemList(state.Items, dispatch), clearButton(undefined, dispatch)], ["children", reactApi.Children.toArray(Array.from(elems))])])))], ["children", reactApi.Children.toArray(Array.from(elems_1))])])));
}

ProgramModule_run(Program_withReactSynchronous("elmish-app", ProgramModule_mkSimple(init, update, render)));

