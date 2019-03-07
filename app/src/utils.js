export const sortList = (array, sort) => {
  array.sort((a, b) => {
    const aField = a[sort.id] || ""; //avoid null comparisons
    const bField = b[sort.id] || "";
    const shouldSwap = sort.desc
      ? bField > aField //descending
      : aField > bField; //ascending

    return shouldSwap ? 1 : -1;
  });
};
