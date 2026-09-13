import Navbar from '../../components/Navbar';
import MomentsBoard from './MomentsBoard';
import { siteConfig } from '../../siteConfig';
export const metadata = { title: '说说 | ' + siteConfig.title, description: '生活动态与瞬间记录' };
export default function MomentsPage() { return <><Navbar /><MomentsBoard /></>; }
