'use client';

import type { AnySceneObject } from '@/types/scene';
import { OBJECT_REGISTRY } from './registry';

export default function ObjectRenderer({ obj }: { obj: AnySceneObject }) {
  const { Component } = OBJECT_REGISTRY[obj.type];
  // Component is typed per its own ObjectType; obj is narrowed to that type by obj.type above.
  return <Component obj={obj as never} />;
}
