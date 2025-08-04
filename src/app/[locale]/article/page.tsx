import { Link } from "@/i18n/navigation";
import { FileQuestion } from "lucide-react";

export default function ArticleIndexPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <FileQuestion className="h-20 w-20 text-muted-foreground/50 mb-6" />
      <h1 className="text-2xl font-bold">No Article Selected</h1>
      <p className="text-muted-foreground max-w-md mt-2">
        It looks like you've landed on the articles page without selecting a
        specific one. Please return to the feed to choose an article to read.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
      >
        Return to Feed
      </Link>
    </div>
  );
}
