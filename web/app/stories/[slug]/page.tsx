import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import SiteFooter from "@/components/SiteFooter";
import FloridaStory from "@/components/FloridaStory";
import ComingSoonStory from "@/components/ComingSoonStory";
import { STORIES } from "@/lib/pulseData";

const SLUGS = STORIES.map((s) => s.slug);

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = STORIES.find((s) => s.slug === slug);
  if (!story) return { title: "The National Pulse — Story Not Found" };
  return {
    title: `${story.title} — The National Pulse`,
    description: story.dek,
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = STORIES.find((s) => s.slug === slug);
  if (!story) notFound();

  return (
    <>
      <TopBar />
      {slug === "florida-is-cooking" ? (
        <FloridaStory />
      ) : (
        <ComingSoonStory story={story} />
      )}
      <SiteFooter />
    </>
  );
}
