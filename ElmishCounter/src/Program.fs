module App

open Elmish
open Elmish.React
open Feliz

type State =
    {
        Count: int
    }

let init() = { Count = 0 }

type Msg =
    | Increment

let update (msg: Msg) (state: State): State =
    match msg with
    | Increment -> { state with Count = state.Count + 1 }

let render (state: State) (dispatch: Msg -> unit) =
    Html.div [
        prop.classes [ "field"; "has-addons" ]
        prop.children [
            Html.button [
                prop.onClick (fun _ -> dispatch Increment)
                prop.classes [ "button"; "control"; "is-small"; "is-primary" ]
                prop.children [
                    Html.i [ prop.classes [ "fa"; "fa-plus" ]]
                ]
            ]
            Html.div [
                prop.classes [ "box"; "control"; "is-small" ]
                prop.children [
                    Html.p state.Count
                ]
            ]
        ]
    ]

Program.mkSimple init update render
|> Program.withReactSynchronous "elmish-app"
|> Program.run