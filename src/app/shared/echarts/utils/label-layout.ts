import { LabelLayoutOptionCallback } from 'echarts';
import { flatten } from 'lodash';

/** 使用标准单系列（柱状、折线）标签布局 */
export const useStandardSingleSeriesLabelLayout = (
  rate: number = 1,
  minGap: number = 4
) => {
  let lastPointInfo: {
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  minGap = minGap * rate;
  return function (params) {
    //console.log(params);
    if (!lastPointInfo || params.dataIndex == 0) {
      //第一个节点，直接pass
      lastPointInfo = {
        index: params.dataIndex,
        ...params.labelRect,
      };
      return {
        x: lastPointInfo.x,
        y: lastPointInfo.y,
      };
    }
    const xValid =
      params.labelRect.x >= lastPointInfo.x + lastPointInfo.width + minGap;
    const yValid =
      params.labelRect.y + params.labelRect.height <= lastPointInfo.y || //当前标签在上一个标签的上方时
      params.labelRect.y >= lastPointInfo.y + lastPointInfo.height; //或者当前标签在上一个标签的下方时

    if (xValid || yValid) {
      //当前节点在安全区域，pass
      lastPointInfo = {
        index: params.dataIndex,
        ...params.labelRect,
      };
      return {
        x: lastPointInfo.x,
        y: lastPointInfo.y,
      };
    }
    if (
      lastPointInfo.y + lastPointInfo.height + params.labelRect.height <=
      params.rect.y
    ) {
      //当前节点如果有向下放置的空间，就往下走，反之，往上走
      lastPointInfo = {
        index: params.dataIndex,
        ...params.labelRect,
        y: lastPointInfo.y + lastPointInfo.height,
      };
      return {
        x: lastPointInfo.x,
        y: lastPointInfo.y,
      };
    } else {
      //节点往上走
      lastPointInfo = {
        index: params.dataIndex,
        ...params.labelRect,
        y: lastPointInfo.y - params.labelRect.height,
      };
      return {
        x: lastPointInfo.x,
        y: lastPointInfo.y,
      };
    }
  } as LabelLayoutOptionCallback;
};

interface LastPointInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  seriesIndex?: number;
  dataIndex?: number;
}

/** 使用标准水平单柱子、多柱子、单折线的标签布局 */
export const useStandardMultiHorizontalLabelLayout = (
  infos: LastPointInfo[][],
  rate: number = 1,
  xMinGap: number = 4,
  yMinGap: number = 4
) => {
  xMinGap = xMinGap * rate;
  yMinGap = yMinGap * rate;
  const add = (seriesIndex: number, dataIndex: number, info: LastPointInfo) => {
    if (!infos[seriesIndex]) infos[seriesIndex] = [];
    info.seriesIndex = seriesIndex;
    info.dataIndex = dataIndex;
    infos[seriesIndex][dataIndex] = info;
    return {
      x: info.x,
      y: info.y,
    };
  };
  return function (params) {
    //console.log(params);
    const { seriesIndex, dataIndex, labelRect } = params;
    if (seriesIndex == 0 && dataIndex == 0) {
      //第一个节点，直接pass
      return add(seriesIndex, dataIndex, {
        ...params.labelRect,
      });
    }

    const compareNodes: LastPointInfo[] = [
      infos[seriesIndex]?.[dataIndex - 1], //避开同系列的前一个数据项
      ...infos.slice(0, seriesIndex).map((row) => row[dataIndex]), //避开当前数据项的前面所有系列
    ].filter((item) => item); //找出所有需要避让的节点

    const xConflictNodes = compareNodes.filter(
      (item) => labelRect.x < item.x + item.width + xMinGap
    ); //找出所有x轴上冲突的点
    //console.log(compareNodes, xConflictNodes, labelRect, infos);
    //先往图形的上方找空间
    const result = findPlacementPositionFromEnd(
      0,
      params.rect.y,
      xConflictNodes.map((node) => {
        return {
          start: node.y,
          end: node.y + node.height,
        };
      }),
      labelRect.height //+ yMinGap
    );

    if (!result) {
      //图形上方没有足够的空间，必须往下找
      const result2 = findPlacementPositionFromStart(
        params.rect.y,
        99999999,
        xConflictNodes.map((node) => {
          return {
            start: node.y,
            end: node.y + node.height,
          };
        }),
        labelRect.height + yMinGap
      );
      if (!result2) {
        //如果还是找不到空间，就摆烂，放原位就算了。
        return add(seriesIndex, dataIndex, { ...labelRect });
      } else {
        return add(seriesIndex, dataIndex, {
          ...labelRect,
          y: result2.start,
        });
      }
    } else {
      //console.log(result, labelRect);
      return add(seriesIndex, dataIndex, {
        ...labelRect,
        y: result.start == labelRect.y ? labelRect.y : result.start, //+ yMinGap,
      });
    }
  } as LabelLayoutOptionCallback;
};

/** 使用标准垂直叠加柱状图、多折线图、垂直叠加柱状图+折线的标签布局 */
export const useStandardMultiVerticalLabelLayout = (
  infos: LastPointInfo[][],
  rate: number = 1,
  xMinGap: number = 4,
  yMinGap: number = 4
) => {
  xMinGap = xMinGap * rate;
  yMinGap = yMinGap * rate;
  const add = (seriesIndex: number, dataIndex: number, info: LastPointInfo) => {
    if (!infos[seriesIndex]) infos[seriesIndex] = [];
    info.seriesIndex = seriesIndex;
    info.dataIndex = dataIndex;
    infos[seriesIndex][dataIndex] = info;
    return {
      x: info.x,
      y: info.y,
    };
  };
  return function (params) {
    const { seriesIndex, dataIndex, labelRect } = params;
    if (seriesIndex == 0 && dataIndex == 0) {
      //第一个节点，直接pass
      return add(seriesIndex, dataIndex, {
        ...params.labelRect,
      });
    }

    const compareNodes: LastPointInfo[] = [
      ...infos.map((row) => row[dataIndex - 1]), //先水平避开前项数据项的所有系列
    ].filter((item) => item);

    const avoidRightNodes: LastPointInfo[] = flatten(
      infos.map((row) => row.slice(dataIndex + 1))
    ).filter((item) => item); //避开水平方向的后方的节点。

    const avoidYNodes = infos
      .slice(0, seriesIndex)
      .map((row) => row[dataIndex]); //要避开的当前数据项的前面系列的节点。

    const xConflictNodes = compareNodes.filter(
      (item) => labelRect.x < item.x + item.width + xMinGap
    ); //找出所有x轴上冲突的点
    const xRightConflictNodes = avoidRightNodes.filter(
      (item) => labelRect.x + labelRect.width + xMinGap > item.x
    );
    //console.log(compareNodes, xConflictNodes, labelRect, infos);
    const fullConflictNodes = [
      ...xConflictNodes,
      ...xRightConflictNodes,
      ...avoidYNodes,
    ];
    //先往图形的上方找空间
    const result = findPlacementPositionFromEnd(
      0,
      params.rect.y - yMinGap,
      fullConflictNodes.map((node) => {
        return {
          start: node.y,
          end: node.y + node.height,
        };
      }),
      labelRect.height //+ yMinGap
    );

    if (!result) {
      //图形上方没有足够的空间，必须往下找
      const result2 = findPlacementPositionFromStart(
        params.rect.y,
        99999999,
        fullConflictNodes.map((node) => {
          return {
            start: node.y,
            end: node.y + node.height,
          };
        }),
        labelRect.height //+ yMinGap
      );
      if (!result2) {
        //如果还是找不到空间，就摆烂，放原位就算了。
        return add(seriesIndex, dataIndex, { ...labelRect });
      } else {
        return add(seriesIndex, dataIndex, {
          ...labelRect,
          y: result2.start,
        });
      }
    } else {
      //console.log(result, labelRect);
      return add(seriesIndex, dataIndex, {
        ...labelRect,
        y: result.start, //+ yMinGap,
      });
    }
  } as LabelLayoutOptionCallback;
};

/** 使用标准水平多柱子+多折线的标签布局 */
export const useStandardMultiHorizontalBarWithLinesLabelLayout = (
  infos: LastPointInfo[][],
  /** 有几根柱子 */
  barItemNumber: number,
  rate: number = 1,
  xMinGap: number = 8,
  yMinGap: number = 8
) => {
  const barHandler = useStandardMultiHorizontalLabelLayout(
    infos,
    rate,
    xMinGap,
    yMinGap
  );
  const verticalHandler = useStandardMultiVerticalLabelLayout(
    infos,
    rate,
    xMinGap,
    yMinGap
  );

  return function (params) {
    if (params.seriesIndex < barItemNumber) return barHandler(params);
    return verticalHandler(params);
  } as LabelLayoutOptionCallback;
};

//#region 查找区间内离最大值最近的可用区间的工具和方法

interface Interval {
  start: number;
  end: number;
}

function findPlacementPositionFromEnd(
  minValue: number,
  maxValue: number,
  existingIntervals: Interval[],
  width: number
): Interval | null {
  existingIntervals = existingIntervals.filter(
    (item) => !(item.end < minValue || item.start > maxValue)
  );
  // 1. 合并重叠的区间
  const mergedIntervals = mergeIntervals(existingIntervals);

  // 2. 在有效范围内查找可用区间
  const validIntervals: Interval[] = [];

  // 检查 minValue 到第一个区间之间的空间
  const firstInterval = mergedIntervals[0];
  if (firstInterval) {
    const gapStart = minValue;
    const gapEnd = firstInterval.start;
    if (gapEnd - gapStart >= width) {
      validIntervals.push({ start: gapStart, end: gapEnd });
    }
  } else {
    // 如果没有现有区间，直接从最大值减去宽度开始
    const start = Math.max(minValue, maxValue - width);
    if (start >= minValue && maxValue - start >= width) {
      return { start, end: start + width };
    }
    return null;
  }

  // 检查区间之间的空间
  for (let i = 0; i < mergedIntervals.length - 1; i++) {
    const current = mergedIntervals[i];
    const next = mergedIntervals[i + 1];

    const gapStart = current.end;
    const gapEnd = next.start;

    if (gapEnd - gapStart >= width) {
      validIntervals.push({ start: gapStart, end: gapEnd });
    }
  }

  // 检查最后一个区间到 maxValue 之间的空间
  const lastInterval = mergedIntervals[mergedIntervals.length - 1];
  if (lastInterval) {
    const gapStart = lastInterval.end;
    const gapEnd = maxValue;
    if (gapEnd - gapStart >= width) {
      validIntervals.push({ start: gapStart, end: gapEnd });
    }
  }

  // 3. 按距离 maxValue 的远近排序，找到最近的可用位置（从右往左查找）
  if (validIntervals.length === 0) {
    return null;
  }

  const placementCandidates: Interval[] = [];

  for (const gap of validIntervals) {
    // 在可用区间内，从最右边（尽可能接近 maxValue）开始放置
    // 放置的结束位置不能超过 maxValue
    const maxPossibleEnd = Math.min(gap.end, maxValue);
    const maxPossibleStart = maxPossibleEnd - width;

    // 确保起始位置在 gap 内且不小于 gap.start
    if (maxPossibleStart >= gap.start && maxPossibleStart >= minValue) {
      // 从最右边开始放
      placementCandidates.push({
        start: maxPossibleStart,
        end: maxPossibleStart + width,
      });
    } else {
      // 如果从最右边放不下，尝试从左边开始，但要确保仍然在 gap 内
      if (gap.end - gap.start >= width) {
        // 从 gap.start 开始放
        placementCandidates.push({
          start: gap.start,
          end: gap.start + width,
        });
      }
    }
  }

  // 按距离 maxValue 的远近排序（结束值越大，距离 maxValue 越近）
  placementCandidates.sort((a, b) => {
    // 优先按结束位置从大到小排序
    if (b.end !== a.end) {
      return b.end - a.end;
    }
    // 结束位置相同，按开始位置从大到小排序
    return b.start - a.start;
  });

  return placementCandidates[0] || null;
}

function findPlacementPositionFromStart(
  minValue: number,
  maxValue: number,
  existingIntervals: Interval[],
  width: number
): Interval | null {
  existingIntervals = existingIntervals.filter(
    (item) => !(item.end < minValue || item.start > maxValue)
  );

  // 1. 合并重叠的区间
  const mergedIntervals = mergeIntervals(existingIntervals);

  // 2. 在有效范围内查找可用区间
  const validIntervals: Interval[] = [];

  // 检查 minValue 到第一个区间之间的空间
  const firstInterval = mergedIntervals[0];
  if (firstInterval) {
    const gapStart = minValue;
    const gapEnd = firstInterval.start;
    if (gapEnd - gapStart >= width) {
      validIntervals.push({ start: gapStart, end: gapEnd });
    }
  } else {
    // 如果没有现有区间，直接检查整个范围
    if (maxValue - minValue >= width) {
      return { start: minValue, end: minValue + width };
    }
    return null;
  }

  // 检查区间之间的空间
  for (let i = 0; i < mergedIntervals.length - 1; i++) {
    const current = mergedIntervals[i];
    const next = mergedIntervals[i + 1];

    const gapStart = current.end;
    const gapEnd = next.start;

    if (gapEnd - gapStart >= width) {
      validIntervals.push({ start: gapStart, end: gapEnd });
    }
  }

  // 检查最后一个区间到 maxValue 之间的空间
  const lastInterval = mergedIntervals[mergedIntervals.length - 1];
  if (lastInterval) {
    const gapStart = lastInterval.end;
    const gapEnd = maxValue;
    if (gapEnd - gapStart >= width) {
      validIntervals.push({ start: gapStart, end: gapEnd });
    }
  }

  // 3. 按距离 minValue 的远近排序，找到最近的可用位置
  if (validIntervals.length === 0) {
    return null;
  }

  // 在每个有效区间内，从最接近 minValue 的位置开始放置
  const placementCandidates: Interval[] = [];

  for (const interval of validIntervals) {
    // 如果区间起点大于等于 minValue，就从起点开始
    if (interval.start >= minValue) {
      placementCandidates.push({
        start: interval.start,
        end: interval.start + width,
      });
    }
    // 否则，如果区间内可以容纳从 minValue 开始的宽度
    else if (interval.end - minValue >= width) {
      placementCandidates.push({
        start: minValue,
        end: minValue + width,
      });
    }
  }

  // 按起点排序，找到离 minValue 最近的
  placementCandidates.sort((a, b) => a.start - b.start);

  return placementCandidates[0] || null;
}

// 合并重叠区间的辅助函数
function mergeIntervals(intervals: Interval[]): Interval[] {
  if (intervals.length === 0) return [];

  intervals.sort((a, b) => a.start - b.start);

  const merged: Interval[] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const lastMerged = merged[merged.length - 1];

    if (current.start <= lastMerged.end) {
      lastMerged.end = Math.max(lastMerged.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

//#endregion
