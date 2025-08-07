import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const LOCAL_STORAGE_KEY = "giftMatcherData";

export function GiftMatcher({ onBack }: { onBack?: () => void } = {}) {
  const [persons, setPersons] = useState([{ name: "", email: "" }]);
  const [restrictionIndex, setRestrictionIndex] = useState<number | null>(null);
  const [restrictions, setRestrictions] = useState<Record<number, number[]>>({});
  const [matches, setMatches] = useState<number[] | null>(null);
  const [amount, setAmount] = useState("");
  const [tempRestrictions, setTempRestrictions] = useState<number[]>([]);

  // Load saved data on mount
  useEffect(() => {
    const raw = typeof localStorage !== "undefined" &&
      localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (Array.isArray(data.persons)) setPersons(data.persons);
      if (data.restrictions) setRestrictions(data.restrictions);
      if (typeof data.amount === "string") setAmount(data.amount);
    } catch (err) {
      console.error("Failed to parse saved data", err);
    }
  }, []);

  // Persist form data while editing
  useEffect(() => {
    if (matches) return; // don't save after matching
    const data = JSON.stringify({ persons, restrictions, amount });
    localStorage.setItem(LOCAL_STORAGE_KEY, data);
  }, [persons, restrictions, amount, matches]);

  useEffect(() => {
    if (restrictionIndex !== null) {
      setTempRestrictions(restrictions[restrictionIndex] ?? []);
    }
  }, [restrictionIndex]);

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

  const saveRestriction = (values: number[]) => {
    if (restrictionIndex === null) return;
    setRestrictions({
      ...restrictions,
      [restrictionIndex]: values,
    });
    setRestrictionIndex(null);
  };

  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleMatch = async () => {
    const n = persons.length;
    const indices = Array.from({ length: n }, (_, i) => i);

    for (let attempt = 0; attempt < 1000; attempt++) {
      const shuffled = shuffle(indices);
      let valid = true;
      for (let i = 0; i < n; i++) {
        const target = shuffled[i];
        if (target === i || restrictions[i]?.includes(target)) {
          valid = false;
          break;
        }
      }
      if (valid) {
        setMatches(shuffled);
        // localStorage.removeItem(LOCAL_STORAGE_KEY);

        try {
          await fetch("/api/sendEmails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ persons, matches: shuffled, amount }),
          });
        } catch (err) {
          console.error(err);
        }

        return;
      }
    }
    alert("Couldn't generate a valid match with current restrictions.");
  };

  return (
    <div className="container mx-auto p-8 relative z-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Angelito Matcher</h1>
      {onBack && (
        <button className="underline mb-4 text-sm" onClick={onBack}>
          ← Back to Home
        </button>
      )}

      <Card className="bg-card/50 backdrop-blur-sm border-muted">
        <CardContent className="pt-6 flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <span>RD$</span>
            <Input
              type="number"
              placeholder="Monto"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-32"
            />
          </div>
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

          <div className="flex gap-4">
            <button className="underline text-sm flex items-center gap-1" onClick={addPerson}>
              <Plus className="size-3.5" />
              Add person
            </button>
            <Button size="lg" onClick={() => handleMatch()}>Match</Button>
          </div>
        </CardContent>
      </Card>

      {restrictionIndex !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-card text-card-foreground p-6 rounded-md space-y-4 w-80">
            <h2 className="font-bold text-lg">
              {persons[restrictionIndex].name || `Person ${restrictionIndex + 1}`} can't match with
            </h2>
            <div className="space-y-2">
              {persons.map((p, idx) =>
                idx === restrictionIndex ? null : (
                  <label key={idx} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={tempRestrictions.includes(idx)}
                      onChange={e => {
                        setTempRestrictions(prev =>
                          e.target.checked
                            ? [...prev, idx]
                            : prev.filter(i => i !== idx),
                        );
                      }}
                    />
                    {p.name || `Person ${idx + 1}`}
                  </label>
                ),
              )}
            </div>
            <div className="flex justify-end gap-4 pt-2">
              <button
                className="underline text-sm"
                onClick={() => setRestrictionIndex(null)}
              >
                Cancel
              </button>
              <button
                className="underline text-sm"
                onClick={() => saveRestriction(tempRestrictions)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GiftMatcher;
