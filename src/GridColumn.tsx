import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement, type RefAttributes } from 'react';
import type { GridDefaultItem } from './generated/Grid.js';
import {
  GridColumn as _GridColumn,
  type GridColumnElement,
  type GridColumnProps as _GridColumnProps,
} from './generated/GridColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleRenderer } from './renderers/useSimpleRenderer.js';

export * from './generated/GridColumn.js';

export type GridColumnProps<TItem> = Partial<
  Omit<_GridColumnProps<TItem>, 'children' | 'footerRenderer' | 'headerRenderer' | 'renderer'>
> &
  Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridColumn<TItem = GridDefaultItem>(
  props: GridColumnProps<TItem>,
  ref: ForwardedRef<GridColumnElement<TItem>>,
): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleRenderer(props.headerRenderer);
  const [footerPortals, footerRenderer] = useSimpleRenderer(props.footerRenderer);
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer ?? props.children);

  return (
    <_GridColumn<TItem>
      {...props}
      footerRenderer={footerRenderer}
      headerRenderer={headerRenderer}
      ref={ref}
      renderer={bodyRenderer}
    >
      {headerPortals}
      {footerPortals}
      {bodyPortals}
    </_GridColumn>
  );
}

const ForwardedGridColumn = forwardRef(GridColumn) as <TItem = GridDefaultItem>(
  props: GridColumnProps<TItem> & RefAttributes<GridColumnElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridColumn as GridColumn };
