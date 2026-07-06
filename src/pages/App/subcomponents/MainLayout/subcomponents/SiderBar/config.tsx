import {
  AccountantTabSVG,
  FastExpertiseTabSVG,
  AdviseTabSVG,
  PriceTabSVG,
  ProfileTabSVG,
  AssetPriceTabSVG,
  RoleTabSVG,
  SettingTabSVG,
  StatisticTabSVG,
  CategoryTabSVG,
  AccountManageSVG,
  PersonalInforSVG,
} from "assets/images";
const iconsMenus = new Map();

iconsMenus.set("ProfileSVG", <ProfileTabSVG></ProfileTabSVG>);
iconsMenus.set("FastExpertiseSVG", <FastExpertiseTabSVG></FastExpertiseTabSVG>);
iconsMenus.set("AdviseSVG", <AdviseTabSVG></AdviseTabSVG>);
iconsMenus.set("CommonPriceWarehouseSVG", <PriceTabSVG></PriceTabSVG>);
iconsMenus.set("SpecifyPriceWarehouseSVG", <PriceTabSVG></PriceTabSVG>);
iconsMenus.set("AssetPriceSVG", <AssetPriceTabSVG></AssetPriceTabSVG>);
iconsMenus.set("AccountantSVG", <AccountantTabSVG></AccountantTabSVG>);
iconsMenus.set("StatisticSVG", <StatisticTabSVG></StatisticTabSVG>);
iconsMenus.set("CategorySVG", <CategoryTabSVG></CategoryTabSVG>);
iconsMenus.set("SystemSVG", <RoleTabSVG></RoleTabSVG>);
iconsMenus.set("IntegrateSVG", <SettingTabSVG></SettingTabSVG>);
iconsMenus.set("userSVG", <AccountManageSVG></AccountManageSVG>);
iconsMenus.set("personalSVG", <PersonalInforSVG></PersonalInforSVG>);
iconsMenus.set("restartSVG", <AdviseTabSVG></AdviseTabSVG>);

export { iconsMenus };
