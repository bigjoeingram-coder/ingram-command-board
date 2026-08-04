# Command Board Data Schema

This file is the contract for `data.json`. Any automation, controller sweep, or hourly board refresh that updates `data.json` must preserve this schema.

## Required Top-Level Fields

`data.json` must contain:

- `updated` string
- `launch` object
- `needsJoe` array
- `revenueBlocked` array
- `inMotion` array
- `systems` array
- `parked` string

## Required Launch Fields

`launch` must contain:

- `name` string
- `deadline` string
- `status` string
- `focus` string
- `pacing` array with at least one item

Each `launch.pacing` item must contain:

- `lane` string
- `state` string
- `next` string

Valid `state` examples:

- `Pacing`
- `Behind`
- `At-risk`
- `Overnight candidate`

## Required Needs Joe Shape

`needsJoe` must be an array of objects, not strings.

Each item must contain:

- `n` string or number
- `text` string

## Required In Motion Shape

`inMotion` must be an array of objects.

Each item must contain:

- `who` string
- `text` string

## Fail-Closed Rule

If an automated refresh cannot populate `launch.pacing`, it must not overwrite `data.json`.

If an automated refresh has only partial data, it must merge partial updates into the existing schema instead of replacing the whole file.

Never commit a `data.json` payload that would cause the TV board to show `No pacing loaded.`

## Known Failure From 2026-08-04

A later hourly refresh replaced a richer TV-board payload with a thin older schema that omitted `launch`. The page still rendered, but the August 10 panel fell back to `No pacing loaded.` Future refresh code must validate this schema before commit.
