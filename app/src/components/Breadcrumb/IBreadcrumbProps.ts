export interface IBreadcrumbProps {

  /**
   * Collection of breadcrumbs to render
   */
  items: IBreadcrumbItem[];

  bgColor: string;
  hoverBgColor: string;
  currentBgColor: string;

  className?: string;

}

export interface IBreadcrumbItem {

  /**
   * Text to display to the user for the breadcrumb
   */
  text: string;

  /**
   * Arbitrary unique string associated with the breadcrumb
   */
  key: string;

  /**
   * Callback issued when the breadcrumb is selected.
   */
  onClick?: (ev?: React.MouseEvent<HTMLElement>, item?: IBreadcrumbItem) => void;

  /**
   * Url to navigate to when this breadcrumb is clicked.
   */
  href?: string;
}
