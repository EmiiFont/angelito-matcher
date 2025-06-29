import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function GiftMatcher({ onBack }: { onBack: () => void }) {
  const [persons, setPersons] = useState([{ name: "", email: "" }]);
  const [restrictionIndex, setRestrictionIndex] = useState<number | null>(null);
  const [restrictions, setRestrictions] = useState<Record<number, number | null>>({});

  const addPerson = () => setPersons([...persons, { name: "", email: "" }]);

  const updatePerson = (
    index: number,
    field: "name" | "email",
    value: string,
  ) => {
    const newPersons = [...persons];
    newPersons[index] = { ...newPersons[index], [field]: value };
    setPersons(newPersons);
  };

  const saveRestriction = (value: string) => {
    if (restrictionIndex === null) return;
    setRestrictions({
      ...restrictions,
      [restrictionIndex]: value === "" ? null : Number(value),
    });
    setRestrictionIndex(null);
  };

  return (
    <div className="container mx-auto p-8 relative z-10">
      <button className="underline mb-4 text-sm" onClick={onBack}>
        ← Back to Home
      </button>

      <Card className="bg-card/50 backdrop-blur-sm border-muted">
        <CardContent className="pt-6 flex flex-col gap-4">
          {persons.map((p, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <Input
                placeholder="Name"
                value={p.name}
                onChange={e => updatePerson(idx, "name", e.target.value)}
              />
              <Input
                placeholder="Email"
                value={p.email}
                onChange={e => updatePerson(idx, "email", e.target.value)}
              />
              <button
                className="underline text-sm"
                onClick={() => setRestrictionIndex(idx)}
              >
                Set restriction
              </button>
            </div>
          ))}

          <button className="underline text-sm" onClick={addPerson}>
            Add person
          </button>
        </CardContent>
      </Card>

      {restrictionIndex !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-card text-card-foreground p-6 rounded-md space-y-4 w-80">
            <h2 className="font-bold text-lg">
              {persons[restrictionIndex].name || `Person ${restrictionIndex + 1}`} can't match with
            </h2>
            <Select
              value={
                restrictions[restrictionIndex] !== undefined &&
                restrictions[restrictionIndex] !== null
                  ? String(restrictions[restrictionIndex])
                  : ""
              }
              onValueChange={saveRestriction}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No restriction</SelectItem>
                {persons.map((p, idx) =>
                  idx === restrictionIndex ? null : (
                    <SelectItem key={idx} value={String(idx)}>
                      {p.name || `Person ${idx + 1}`}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <div className="flex justify-end">
              <button
                className="underline text-sm mt-2"
                onClick={() => setRestrictionIndex(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GiftMatcher;
