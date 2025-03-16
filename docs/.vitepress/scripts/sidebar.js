// .vitepress/scripts/sidebar.js
import fs from 'node:fs'
import path from 'node:path'

/**
 * 生成符合 VitePress 规范的侧边栏配置
 * @param {string} rootDir 文档根目录（如 './docs'）
 * @param {string} basePath 当前递归路径（初始调用时传空字符串）
 * @returns {Array} 侧边栏配置数组
 */
function generateSidebar(rootDir, basePath = '') {
  const dirPath = path.join(rootDir, basePath)
  const items = fs.readdirSync(dirPath)

  return items
    // 过滤隐藏文件和目录（如 .vitepress、node_modules）
    .filter(item => !item.startsWith('.') && !['node_modules'].includes(item)
    && item !== 'index.md')
    // 按文件名数字前缀排序（如 01-Introduction）
    .sort((a, b) => {
      const numA = parseInt(a.match(/^\d+/)?.[0] || 0)
      const numB = parseInt(b.match(/^\d+/)?.[0] || 0)
      return numA - numB
    })
    .map(item => {
      const fullPath = path.join(dirPath, item)
      const relativePath = path.join(basePath, item)
      const isDir = fs.statSync(fullPath).isDirectory()

      if (isDir) {
        return {
          text: formatTitle(item), // 格式化标题（去除数字前缀）
          collapsed: false, // 默认展开
          items: generateSidebar(rootDir, relativePath)
        }
      } else if (item.endsWith('.md') && item !== 'index.md') {
        return {
          text: getMarkdownTitle(fullPath), // 从 Markdown 中提取标题
          link: `/${relativePath.replace('.md', '')}`
        }
      }
    })
    .filter(Boolean) // 过滤空项（非目录和非 Markdown 文件）
}

/**
 * 从 Markdown 文件中提取标题（优先读取 YAML frontmatter）
 * @param {string} filePath Markdown 文件路径
 */
function getMarkdownTitle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const titleMatch = content.match(/^title:\s*(.+)$/m)
  return titleMatch?.[1] || formatTitle(path.basename(filePath, '.md'))
}

/**
 * 格式化目录/文件名（去除数字前缀和分隔符）
 * @example '01-Introduction' → 'Introduction'
 */
function formatTitle(str) {
  return str.replace(/^\d+[-_.\s]*/, '')
}

module.exports = generateSidebar