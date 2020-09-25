declare module "*.png"
declare module "*.svg"

declare module "vertical-timeline-component-for-react" {
  interface Timeline {
    lineColor: string
  }

  interface TimelineItem {
    key: string
    dateComponent: JSX.Element
    style: CSSStyleDeclaration
  }

  export const Timeline = Timeline
  export const TimelineItem = TimelineItem
}
