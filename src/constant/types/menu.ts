type MenuType = {
  menuId: number;
  displayName: string;
  displayIcon?: string;
  path?: string;
  menuLevel: number;
  parentMenu: number;
  sequence: number;
  description: string;
  roleIds: string;
  whoCreate: string;
  menuDtos: Array<MenuType>;
};

export type { MenuType };
