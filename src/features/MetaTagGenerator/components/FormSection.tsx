import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useMetaTagStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function FormSection() {
  const pageTitle = useMetaTagStore((s) => s.pageTitle);
  const description = useMetaTagStore((s) => s.description);
  const url = useMetaTagStore((s) => s.url);
  const imageUrl = useMetaTagStore((s) => s.imageUrl);
  const siteName = useMetaTagStore((s) => s.siteName);
  const twitterHandle = useMetaTagStore((s) => s.twitterHandle);
  const getMetaTags = useMetaTagStore((s) => s.getMetaTags);
  const setPageTitle = useMetaTagStore((s) => s.setPageTitle);
  const setDescription = useMetaTagStore((s) => s.setDescription);
  const setUrl = useMetaTagStore((s) => s.setUrl);
  const setImageUrl = useMetaTagStore((s) => s.setImageUrl);
  const setSiteName = useMetaTagStore((s) => s.setSiteName);
  const setTwitterHandle = useMetaTagStore((s) => s.setTwitterHandle);

  const titleLength = pageTitle.length;
  const descLength = description.length;
  const metaTags = getMetaTags();

  return (
    <>
      <section className="space-y-4">
        <SectionHeading className="mb-3">Page details</SectionHeading>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="pageTitle">Page title</Label>
            <span className={cn('font-mono text-xs', titleLength > 60 ? 'text-destructive' : 'text-muted-foreground')}>
              {titleLength}/60
            </span>
          </div>
          <Input id="pageTitle" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} maxLength={60} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="description">Description</Label>
            <span className={cn('font-mono text-xs', descLength > 160 ? 'text-destructive' : 'text-muted-foreground')}>
              {descLength}/160
            </span>
          </div>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={160}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <p className="text-xs text-muted-foreground">Recommended: 1200×630px</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="siteName">Site name</Label>
          <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitterHandle">Twitter handle</Label>
          <Input id="twitterHandle" value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} />
        </div>
      </section>

      <section className="space-y-2">
        <SectionHeading className="mb-3">Generated output</SectionHeading>
        <pre className="max-h-48 overflow-auto border border-border bg-muted/40 p-3 font-mono text-[10px] whitespace-pre-wrap break-all">
          {metaTags}
        </pre>
      </section>
    </>
  );
}
