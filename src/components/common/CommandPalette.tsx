import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlass, FilmStrip } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { contentItems, popularKeywords } from "@/data/mockContent";
import { getSearchHistory, saveSearchTerm } from "@/lib/storage";

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRecent(getSearchHistory());
  }, [open]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const results = useMemo(() => {
    if (!query.trim()) return contentItems.slice(0, 5);
    const q = query.toLowerCase();
    return contentItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.genres.some((genre) => genre.toLowerCase().includes(q)) ||
        item.cast.some((member) => member.name.toLowerCase().includes(q))
      );
    });
  }, [query]);

  const goToResult = (value: string, href?: string) => {
    const nextRecent = saveSearchTerm(value);
    setRecent(nextRecent);
    onOpenChange(false);
    if (href) {
      navigate(href);
    } else {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card text-card-foreground sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-left text-xl font-medium uppercase tracking-[0.1em] text-foreground">
            Quick search
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-3 rounded-md border border-border bg-input px-4">
            <MagnifyingGlass
              size={32}
              weight="duotone"
              className="text-muted-foreground"
            />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, genres, cast, or keywords"
              className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>

          {!query.trim() ? (
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm text-muted-foreground">
                  Recent searches
                </p>
                <div className="flex flex-wrap gap-3">
                  {recent.length > 0 ? (
                    recent.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => goToResult(term)}
                        className="rounded-full border border-border bg-muted px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        {term}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent searches yet.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm text-muted-foreground">
                  Popular keywords
                </p>
                <div className="flex flex-wrap gap-3">
                  {popularKeywords.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => goToResult(term)}
                      className="rounded-full border border-border bg-secondary/30 px-4 py-2 text-sm text-secondary-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <ul className="space-y-3" aria-label="Search results">
              {results.length > 0 ? (
                results.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() =>
                        goToResult(
                          item.title,
                          item.type === "movie"
                            ? `/movie/${item.slug}`
                            : `/series/${item.slug}`,
                        )
                      }
                      className="flex w-full items-center gap-4 rounded-lg border border-border bg-background px-4 py-4 text-left transition-colors hover:border-primary"
                    >
                      <img
                        src={item.posterImage}
                        alt={item.posterAlt}
                        loading="lazy"
                        className="h-20 w-14 rounded-md object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-base text-foreground">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.category} · {item.year} ·{" "}
                          {item.genres.join(", ")}
                        </p>
                      </div>
                      <FilmStrip
                        size={32}
                        weight="duotone"
                        className="text-primary"
                      />
                    </button>
                  </li>
                ))
              ) : (
                <li className="rounded-lg border border-border bg-background px-4 py-10 text-center">
                  <p className="text-base text-foreground">
                    No quick matches found.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Press enter on the search page for broader results.
                  </p>
                </li>
              )}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
