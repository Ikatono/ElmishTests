module App

open Elmish
open Elmish.React
open Feliz

let toFloat (input: string) =
    let mutable value: float = 0
    match System.Double.TryParse(input, &value) with
    | true -> Some value
    | false -> None


let conToC input = (input - 32.0) / 1.8
let conToF input = (input * 1.8) + 32.0

[<Struct>]
type State = {
    F: string
    C: string
    }

let init(): State = {
    F = ""
    C = ""
    }

type Msg =
    | FChange of string
    | CChange of string

let update (msg: Msg) (state: State): State =
    match msg with
    | FChange f ->
        match f with
        | "" -> {state with F = ""; C = "" }
        | "-" -> {state with F = "-"; C = "" }
        | f -> 
            match (toFloat f) with
            | None -> state
            | Some fnum ->
                let cnum = conToC fnum
                let c = sprintf "%.2f" cnum
                { state with F = f.Trim(); C = c}
    | CChange c ->
        match c with
        | "" -> {state with F = ""; C = "" }
        | "-" -> {state with F = ""; C = "-" }
        | c ->
            match (toFloat c) with
            | None -> state
            | Some cnum ->
                let fnum = conToF cnum
                let f = sprintf "%.2f" fnum
                { state with F = f; C = c.Trim() }

let render (state: State) (dispatch: Msg -> unit) =
    Html.div [
        prop.classes [ "is-horizontal" ]
        prop.children [
            Html.div [
                prop.classes [ "field"; "has-addons" ]
                prop.children [
                    Html.p [
                        prop.classes [ "control" ]
                        prop.children [
                            Html.input [
                                prop.classes [ "input" ]
                                prop.type'.text
                                prop.value state.F
                                prop.onChange (fun value -> dispatch <| FChange value)
                            ]
                        ]
                    ]
                    
                    Html.p [
                        prop.classes [ "control" ]
                        prop.children [
                            Html.p [
                                prop.classes [ "button"; "is-static" ]
                                prop.text "°F"
                            ]
                        ]
                    ]
                ]
            ]
            Html.div [
                prop.classes [ "field"; "has-addons" ]
                prop.children [
                    Html.p [
                        prop.classes [ "control" ]
                        prop.children [
                            Html.input [
                                prop.classes [ "input" ]
                                prop.type'.text
                                prop.value state.C
                                prop.onChange (fun value -> dispatch <| CChange value)
                            ]
                        ]
                    ]
                    
                    Html.p [
                        prop.classes [ "control" ]
                        prop.children [
                            Html.p [
                                prop.classes [ "button"; "is-static" ]
                                prop.text "°C"
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]

Program.mkSimple init update render
|> Program.withReactSynchronous "elmish-app"
|> Program.run