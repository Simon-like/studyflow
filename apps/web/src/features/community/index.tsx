import { Tabs } from '@/components/ui';
import { useCommunity } from './hooks';
import { CommunityHeader } from './components/CommunityHeader';
import { FeedTab } from './components/FeedTab';
import { GroupsTab } from './components/GroupsTab';
import { TAB_ITEMS } from './constants';

export default function CommunityPage() {
  const { posts, groups, activeTab, setActiveTab, toggleLike, joinGroup } =
    useCommunity();

  const tabItems = TAB_ITEMS.map((tab) => ({
    key: tab.key,
    label: tab.label,
  }));

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <CommunityHeader />
      <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} className="mb-6" />

      {activeTab === 'feed' ? (
        <FeedTab posts={posts} onLike={toggleLike} />
      ) : (
        <GroupsTab groups={groups} onJoin={joinGroup} />
      )}
    </div>
  );
}
