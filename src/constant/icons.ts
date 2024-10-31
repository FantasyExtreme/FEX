import freeicon from '@/assets/images/icons/icon-free.png';
import bronzeicon from '@/assets/images/icons/icon-bronze.png';
import goldicon from '@/assets/images/icons/icon-gold.png';
import { Packages } from './variables';

export const PackageIcons: { [p: string]: any } = {
  [Packages.gold]: goldicon,
  [Packages.free]: freeicon,
  [Packages.bronze]: bronzeicon,
};
