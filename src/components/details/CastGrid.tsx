import { motion } from "framer-motion";
import { CastMember } from "@/data/mockContent";

export const CastGrid = ({ cast }: { cast: CastMember[] }) => {
  return (
    <section className="py-8 md:py-10">
      <h2 className="mb-6 text-2xl font-medium uppercase tracking-[0.12em] text-foreground">
        Cast
      </h2>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {cast.map((member, i) => (
          <motion.div
            key={`${member.name}-${member.role}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 card-glow"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium text-foreground">{member.name}</p>
              <p className="truncate text-xs text-muted-foreground">{member.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
