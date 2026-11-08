# DeckPlan

A browser-based 3D stage and event layout tool. Block out a stage, LED walls,
and audience seating, then check the layout from overhead (isometric) or from
the audience's point of view.

Built with Next.js (App Router) + TypeScript, React Three Fiber + drei for the
3D viewport, Zustand for scene state, and Tailwind CSS for the UI.

## Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The editor loads
client-side only (it's dynamically imported with `ssr: false` from
`app/page.tsx`), so there's nothing to configure for local dev beyond the
usual `npm install`.

```bash
npm run build   # production build + type check
npm run lint     # ESLint
```

The scene autosaves to `localStorage` as you work, and a sensible starter
layout loads automatically the first time there's nothing saved.

## Deploying to Vercel

This is a standard Next.js App Router project, so it deploys to Vercel with
no extra configuration:

1. Push the repo to GitHub (or your git host of choice).
2. [Import the project](https://vercel.com/new) in Vercel and accept the
   default Next.js build settings (`next build`).
3. Deploy.

There's no backend or environment variables required — the whole app runs in
the browser, with scene data kept in `localStorage` and exportable as JSON.

## Project structure

```
app/                   Next.js App Router entry (page.tsx dynamically
                        imports the editor with ssr: false)
components/
  editor/               Viewport, camera rig, toolbar, sidebar, properties
                         panel, transform gizmo, keyboard shortcuts
  objects/               One renderer component per object type, plus the
                          type registry (registry.ts)
store/
  sceneStore.ts           All scene state and mutations (Zustand)
lib/                     Geometry/snap/units helpers, persistence, the
                         starter scene, screenshot export
types/
  scene.ts                The scene data model (SceneObject, camera modes,
                          snap settings, etc.)
```

Units are meters throughout (`lib/units.ts` has the single `UNIT` constant,
ready to extend with feet later). Each object's `position` is the
bottom-center of its footprint — a height change grows it upward and it stays
on the floor (or on top of whatever it's resting on) without needing to touch
its stored position.

## Adding a new object type

The object types are driven by a registry
(`components/objects/registry.ts`), so adding one (say, a truss or a speaker
stack) means:

1. **Add the type to the data model.** In `types/scene.ts`, add the new
   `ObjectType` string, a `*Props` type for its type-specific fields (or
   `Record<string, never>` if it has none), and add it to `PropsForType`.
2. **Write the renderer.** Create `components/objects/TrussObject.tsx` — a
   component that takes `{ obj: SceneObject<'truss'> }` and renders its 3D
   geometry, wrapped in `<ObjectShell obj={obj}>...</ObjectShell>` (handles
   selection, the outline highlight, and the transform gizmo for you).
3. **(Optional) Write its properties fields.** If it has type-specific props
   you want editable in the sidebar, export a `TrussFields` component from
   the same file — see `LedWallFields` or `SeatingSectionFields` for the
   shape.
4. **(Optional) Derive its dimensions.** If the object's footprint should be
   computed from its props (like seating rows × spacing), export a
   `deriveDimensions(props)` function — see the `seatingSection` registry
   entry.
5. **Register it.** Add one entry to `OBJECT_REGISTRY` in
   `components/objects/registry.ts` with a label, default dimensions, default
   color, default props, and the `Component` (plus `PropertiesFields` /
   `deriveDimensions` if you wrote them).

That's it — the add-object palette, the outliner, the properties panel, save
and load, undo/redo, and the transform gizmo all pick up the new type
automatically through the registry; nothing else needs to change.

## Keyboard shortcuts

- `W` — move mode, `E` — rotate mode
- `Delete` / `Backspace` — delete the selected object
- `Ctrl`/`Cmd` + `D` — duplicate
- `Ctrl`/`Cmd` + `Z` — undo, `Ctrl`/`Cmd` + `Shift` + `Z` — redo
- `Escape` — deselect

Shortcuts are disabled while typing in an input field.
