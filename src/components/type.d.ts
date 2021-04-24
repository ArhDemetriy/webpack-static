interface Destructible {
  destroy(): void;
}
type ArrayOfDestructible = [() => void, ...Array<Destructible>];
type AllArrayOfDestructible = Array<ArrayOfDestructible>;

export {
  Destructible,
  ArrayOfDestructible,
  AllArrayOfDestructible,
};
