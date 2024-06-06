// 按size拆分成二维数组
export function chunkArrayIntoSubarrays<T>(arr: T[], size: number): T[][] {
  return arr.reduce((chunks: T[][], item: T, index: number) => {
    const chunkIndex = Math.floor(index / size);
    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = [];
    }
    chunks[chunkIndex].push(item);
    return chunks;
  }, []);
}
