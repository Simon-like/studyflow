import { PageLayout } from '@/components/layout/PageLayout'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturesOverview } from '@/components/sections/FeaturesOverview'
import { CTABanner } from '@/components/ui/CTABanner'

export default function Home() {
  return (
    <PageLayout>
      <HeroSection />
      <FeaturesOverview />
      <CTABanner />
    </PageLayout>
  )
}
