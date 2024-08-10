module App

open Elmish
open Elmish.React
open Feliz

//remove an element from a list
//awkward handling of negative indeces and 
let rec remElem index lst =
    match index, lst with
    | i, l when i < 0 -> l
    | 0, head::tail -> tail
    | i, head::tail -> head :: (remElem (i-1) tail)
    | _, _ -> []

let rec repElem elem index lst =
    match index, lst with
    | i, l when i < 0 -> l
    | 0, head::tail -> elem :: tail
    | i, head::tail -> head :: (repElem elem (i-1) tail)
    | _, _ -> []

let rec applyAt fn index lst =
    match index, lst with
    | i, l when i < 0 -> l
    | 0, head::tail -> (fn head) :: tail
    | i, head::tail -> head :: (applyAt fn (i-1) tail)
    | _, _ -> []

// [<Struct>]
// type TodoEdit =
//     {
//         NewText: string
//         Index: int
//     }

type ItemState =
    | None
    | Finished
    | Editing of NewText: string

[<Struct>]
type Item = 
    {
        Text: string
        ItemState: ItemState
    }
    

type State =
    {
        Items: Item list
        Active: string
    }

let init(): State = {
    Items = [] 
    Active = ""
    }

type Msg =
    | Commit
    | Delete of index: int
    | TextChange of text: string
    | ToggleFinish of index: int
    | DeleteFinished
    | StartEdit of index: int
    | EditEdit of index: int * text: string
    | CommitEdit of index: int
    | CancelEdit of index: int

let update (msg: Msg) (state: State): State =
    match msg with
    | Commit ->
        let newItem = { Text = state.Active; ItemState = None }
        let newItems = state.Items @ [newItem]
        { state with Items = newItems; Active = "" }
    | Delete index -> { state with Items = ( remElem index state.Items) }
    | TextChange text -> { state with Active = text }
    | ToggleFinish index ->
        match state.Items.[index].ItemState with
            | Editing _ ->
                //TODO invalid, maybe log, maybe crash
                state
            | Finished ->
                let update item = { item with ItemState = None }
                let newItems = applyAt update index state.Items
                { state with Items = newItems }
            | None ->
                let update item = { item with ItemState = Finished }
                let newItems = applyAt update index state.Items
                { state with Items = newItems }
    | DeleteFinished ->
        let pred item = item.ItemState <> Finished
        let newItems = List.filter pred state.Items
        { state with Items = newItems }
    | StartEdit index ->
        match state.Items.[index] with
        | {ItemState = None; Text = text} ->
            let update item = { item with ItemState = Editing text }
            let newItems = applyAt update index state.Items
            { state with Items = newItems }
        | _ ->
            //TODO invalid, maybe log, maybe crash
            state    
    | EditEdit (index, text) ->
        let update item = { item with ItemState = Editing text }
        let newItems = applyAt update index state.Items
        { state with Items = newItems }
    | CommitEdit index ->
        match state.Items.[index].ItemState with
        | Editing newText ->
            let update item = { item with Text = newText; ItemState = None }
            let newItems = applyAt update index state.Items
            { state with Items = newItems }
        | _ ->
            //TODO invalid, maybe log, maybe crash
            state
    | CancelEdit index ->
        match state.Items.[index].ItemState with
        | Editing _ ->
            let update item = { item with ItemState = None }
            let newItems = applyAt update index state.Items
            { state with Items = newItems }
        | _ ->
            //TODO invalid, maybe log, maybe crash
            state
    

let inputField (active: string) (dispatch: Msg -> unit) =
    Html.div [
        prop.classes [ "field"; "has-addons" ]
        prop.children [
            Html.input [
                prop.classes [ "input"; "is-medium" ]
                prop.type'.text
                prop.placeholder "TODO"
                prop.value active
                prop.onChange ( TextChange >> dispatch )
            ]
            Html.button [
                prop.classes [ "button"; "is-info"; "is-outlined" ] //"is-primary"; "is-medium" ]
                prop.onClick (fun _ -> dispatch Commit)
                prop.disabled ("" = active)
                prop.children [
                    Html.i [ prop.classes [ "fa"; "fa-plus" ]]
                ]
            ]
        ]
    ]

let editButton (index: int) (dispatch: Msg -> unit) =
    Html.button [
        prop.classes [ "button" ]
        prop.onClick (fun _ -> dispatch (StartEdit index))
        prop.children [
            Html.i [ prop.classes [ "fa"; "fa-edit" ]]
        ]
    ]

let finishButton (finished: bool) (index: int) (dispatch: Msg -> unit) =
    Html.button [
        prop.classes [ "button" ]
        prop.onClick (fun _ -> dispatch (ToggleFinish index))
        prop.children [
            Html.i [ prop.classes [ "fa"; "fa-check" ]]
        ]
    ]

let deleteButton (index: int) (dispatch: Msg -> unit) =
    Html.button [
        prop.classes [ "button" ]
        prop.onClick (fun _ -> dispatch (Delete index))
        prop.children [
            Html.i [ prop.classes [ "fa"; "fa-minus" ]]
        ]
    ]

let cancelButton (index: int) (dispatch: Msg -> unit) =
    Html.button [
        prop.classes [ "button" ]
        prop.onClick (fun _ -> dispatch (CancelEdit index))
        prop.children [
            Html.i [ prop.classes [ "fa"; "fa-circle-xmark" ]]
        ]
    ]

let commitButton (index: int) (dispatch: Msg -> unit) =
    Html.button [
        prop.classes [ "button" ]
        prop.onClick (fun _ -> dispatch (CommitEdit index))
        prop.children [
            Html.i [ prop.classes [ "fa"; "fa-check" ]]
        ]
    ]

let itemRow (item: Item) (index: int) (dispatch: Msg -> unit) =
    Html.div [
        prop.classes [ "field"; "has-addons" ]
        prop.children [
            match item.ItemState with
            | None ->
                deleteButton index dispatch
                finishButton false index dispatch
                editButton index dispatch
                Html.p item.Text
            | Finished ->
                deleteButton index dispatch
                finishButton true index dispatch
                Html.s (Html.b item.Text)
            | Editing text ->
                commitButton index dispatch
                cancelButton index dispatch
                Html.input [
                    prop.classes [ "input" ]
                    prop.value text
                    prop.onTextChange (fun text -> dispatch (EditEdit (index, text)))
                ]
            ]
        ]

let itemList (items : Item list) (dispatch: Msg -> unit) =
    Html.ul [
        for index, item in (List.indexed items) ->
            Html.li [
                itemRow item index dispatch
            ]
    ]

let clearButton (state: unit) (dispatch: Msg -> unit) =
    Html.div [
        prop.classes [ "field" ]
        prop.children [
            Html.button [
                prop.classes [ "button" ]
                prop.text "Clear Finished"
                prop.onClick (fun _ -> dispatch DeleteFinished)
            ]
        ]
    ]

let render (state: State) (dispatch: Msg -> unit) =
    Html.div [
        prop.classes [ ]
        prop.children [
            Html.div [
                prop.classes []
                prop.children [
                    inputField state.Active dispatch
                    itemList state.Items dispatch
                    clearButton () dispatch
                ]
            ]
        ]
    ]

Program.mkSimple init update render
|> Program.withReactSynchronous "elmish-app"
|> Program.run