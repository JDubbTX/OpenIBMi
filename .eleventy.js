// const fs = require('fs')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginNavigation = require('@11ty/eleventy-navigation')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const markdownIt = require('markdown-it')
const markdownItEmoji = require('markdown-it-emoji')
const pluginSvgSprite = require("eleventy-plugin-svg-sprite");
const rollupPlugin = require('eleventy-plugin-rollup');

// const collections = require('./utils/collections.js')
const filters = require('./utils/filters.js')
const shortcodes = require('./utils/shortcodes.js')
const pairedshortcodes = require('./utils/paired-shortcodes.js')
// const transforms = require('./utils/transforms.js')
const searchFilter = require("./src/filters/searchFilter");

module.exports = function (eleventyConfig) {
	/**
	 * Plugins
	 * @link https://www.11ty.dev/docs/plugins/
	 */

    eleventyConfig.addPlugin(rollupPlugin, {
		rollupOptions: {
		  output: {
			format: 'es',
			dir: 'dist/assets/js',
		  },
		},
	})

	eleventyConfig.addPlugin(pluginRss)
	eleventyConfig.addPlugin(pluginNavigation)
	eleventyConfig.addPlugin(syntaxHighlight, {
		    preAttributes: {
			    class: ({ language }) => `group/code animate-fade rounded-lg bg-slate-900/80 language-${language || 'plain'}`,
			},
		    // init callback lets you customize Prism
			init: function({ Prism }) {
				Prism.languages.rpgle = {
					'comment': {
						pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
						greedy: true
					},
					'control': { 
						pattern: /\b(CTL\-OPT|VALIDATE|USRPRF|TRUNCNBR|TIMFMT|THREAD|TEXT|STGMDL|SRTSEQ|REQPREXP|PRFDTA|PGMINFO|OPTION|OPTIMIZE|OPENOPT|NOMAIN|MAIN|LANGID|INTPREC|INDENT|GENLVL|FTRANS|FORMSALIGN|FLTDIV|FIXNBR|EXTBININT|EXPROPTS|ENBPFRCOL|DFTNAME|DFTACTGRP|DECPREC|DECEDIT|DEBUG|DATFMT|DATEDIT|DCLOPT|CVTOPT|CURSYM|COPYRIGHT|COPYNEST|CHARCOUNTTYPES|CHARCOUNT|CCSIDCVT|CCSID|BNDDIR|AUT|ALWNULL|ALTSEQ|ACTGRP|ALLOC)\b/i,
						alias: 'keyword' 
					},
					'definition': {
						pattern: /\b(DCL\-|END\-)(S|C|DS|F|PARM|PI|PR|PROC|SUBF)\b/i,
						alias: 'keyword'
					},
					'rpg-bif': {
                        pattern: /%(?:YEARS|XML|XLATE|XFOOT|UPPER|UNSH|UNS|UCS2|TRIMR|TRIML|TRIM|TLOOKUPLT|TLOOKUPLE|TLOOKUPGT|TLOOKUPGE|TLOOKUP|TIMESTAMP|TIME|THIS|TARGET|SUBST|SUBDT|SUBARR|STR|STATUS|SQRT|SPLIT|SIZE|SHTDN|SECONDS|SCANRPL|SCANR|SCAN|RIGHT|REPLACE|REM|REALLOC|RANGE|PROC|PASSED|PARSER|PARMNUM|PARMS|PADDR|OPEN|OMITTED|OCCUR|NULLIND|MSG|MSECONDS|MONTHS|MINUTES|MINARR|MIN|MAXARR|MAX|LOWER|LOOKUPLT|LOOKUPLE|LOOKUPGT|LOOKUPGE|LOOKUP|LIST|LEN|LEFT|KDS|INTH|INT|HOURS|HANDLER|GRAPH|FOUND|FLOAT|FIELDS|ERROR|EQUAL|EOF|ELEM|EDITW|EDITFLT|EDITC|DIV|DIFF|DECPOS|DECH|DEC|DAYS|DATE|DATA|CONCATARR|CONCAT|CHECKR|CHECK|CHARCOUNT|CHAR|BITXOR|BITOR|BITNOT|BITAND|ALLOC|ADDR|ABS)\b/i,
						alias: 'builtin'
					},
					'string': {
						pattern: /'[^']*'/,
						greedy: true
					},
					'sqlreserved': {
						pattern: /\b(?:ZONE|YES|YEARS|YEAR|XSROBJECT|XSLTRANSFORM|XMLVALIDATE|XMLTEXT|XMLTABLE|XMLSERIALIZE|XMLROW|XMLPI|XMLPARSE|XMLNAMESPACES|XMLGROUP|XMLFOREST|XMLELEMENT|XMLDOCUMENT|XMLCONCAT|XMLCOMMENT|XMLCAST|XMLATTRIBUTES|XMLAGG|WRKSTNNAME|WRITE|WRAPPER|WRAPPED|WITHOUT|WITHIN|WITH|WHILE|WHERE|WHENEVER|WHEN|WAIT|VOLATILE|VIEW|VERSION|VCAT|VARIANT|VARIABLE|VALUES|VALUE|USING|USERID|USER|USE|USAGE|URI|UPDATING|UPDATE|UNTIL|UNNEST|UNIT|UNIQUE|UNION|UNDO|TYPE|TRUNCATE|TRIM_ARRAY|TRIM|TRIGGER|TRANSFER|TRANSACTION|TO|TIMESTAMP|TIME|THREADSAFE|THEN|TABLESPACES|TABLESPACE|TABLE|SYSTEM_USER|SYNONYM|SUMMARY|SUBSTRING|STOGROUP|STATIC|STATEMENT|STARTING|START|STACKED|SQLID|SQL|SPECIFIC|SOURCE|SOME|SNAN|SKIP|SIMPLE|SIGNAL|SET|SESSION_USER|SESSION|SEQUENCE|SENSITIVE|SELECT|SECURED|SECQTY|SECONDS|SECOND|SEARCH|SCROLL|SCRATCHPAD|SCHEMA|SBCS|SAVEPOINT|RUN|RRN|ROW_NUMBER|ROWS|ROWNUMBER|ROW|ROUTINE|ROLLUP|ROLLBACK|RIGHT|RID|REVOKE|RETURNS|RETURNING|RETURN|RESULT_SET_LOCATOR|RESULT|RESTART|RESIGNAL|RESET|REPEAT|RENAME|RELEASE|REGEXP_LIKE|REFRESH|REFERENCING|REFERENCES|RECOVERY|READS|READ|RCDFMT|RANK|RANGE|QUERY|PROGRAMID|PROGRAM|PROCEDURE|PRIVILEGES|PRIQTY|PRIOR|PRIMARY|PREVVAL|PREPARE|POSITION|PLAN|PIPE|PIECESIZE|PERMISSION|PCTFREE|PATH|PASSWORD|PASSING|PARTITIONS|PARTITIONING|PARTITIONED|PARTITION|PART|PARAMETER|PAGESIZE|PAGE|PADDED|PACKAGE|OVERRIDING|OVERLAY|OVER|OUTER|OUT|ORGANIZE|ORDINALITY|ORDER|OR|OPTION|OPTIMIZE|OPEN|ONLY|ON|OMIT|OLD_TABLE|OLD|OFFSET|OF|OBID|NVARCHAR|NULLS|NULL|NOT|NORMALIZED|NOORDER|NONE|NOMINVALUE|NOMAXVALUE|NODENUMBER|NODENAME|NOCYCLE|NOCACHE|NO|NEXTVAL|NEW_TABLE|NEW|NESTED|NCLOB|NCHAR|NATIONAL|NAN|NAMESPACE|MONTHS|MONTH|MODIFIES|MODE|MIXED|MINVALUE|MINUTES|MINUTE|MINPCTUSED|MICROSECONDS|MICROSECOND|MERGE|MAXVALUE|MATERIALIZED|MATCHED|MASK|MAINTAINED|LOOP|LONG|LOGGED|LOG|LOCKSIZE|LOCK|LOCATOR|LOCATION|LOCALTIMESTAMP|LOCALTIME|LOCALDATE|LOCAL|LISTAGG|LINKTYPE|LIMIT|LIKE|LEVEL2|LEFT|LEAVE|LATERAL|LANGUAGE|LABEL|KEY|KEEP|JSON_VALUE|JSON_TABLE|JSON_QUERY|JSON_OBJECTAGG|JSON_OBJECT|JSON_EXISTS|JSON_ARRAYAGG|JSON_ARRAY|JOIN|JAVA|ITERATE|ISOLATION|IS|INTO|INTERSECT|INTEGRITY|INSERTING|INSERT|INSENSITIVE|INOUT|INNER|INLINE|INHERIT|INFINITY|INF|INDICATOR|INDEXBP|INDEX|INCREMENT|INCLUSIVE|INCLUDING|INCLUDE|IMPLICITLY|IMMEDIATE|IGNORE|IF|IDENTITY|ID|HOURS|HOUR|HOLD|HINT|HAVING|HASHED_VALUE|HASH|HANDLER|GROUP|GRAPHIC|GRANT|GOTO|GO|GLOBAL|GET|GENERATED|GENERAL|GBPCACHE|FUNCTION|FULL|FROM|FREEPAGE|FREE|FORMAT|FOREIGN|FOR|FINAL|FILE|FIELDPROC|FETCH|FENCED|EXTRACT|EXTERNAL|EXTEND|EXIT|EXISTS|EXECUTE|EXCLUSIVE|EXCLUDING|EXCEPTION|EXCEPT|EVERY|ESCAPE|ERROR|ENFORCED|ENDING|END|ENCRYPTION|ENCODING|ENABLE|EMPTY|ELSEIF|ELSE|EACH|DYNAMIC|DROP|DOUBLE|DOCUMENT|DO|DISTINCT|DISCONNECT|DISALLOW|DISABLE|DIAGNOSTICS|DETERMINISTIC|DESCRIPTOR|DESCRIBE|DESC|DENSE_RANK|DENSERANK|DELETING|DELETE|DEFINITION|DEFINE|DEFER|DEFAULTS|DEFAULT|DECLARE|DEALLOCATE|DEACTIVATE|DBPARTITIONNUM|DBPARTITIONNAME|DBINFO|DB2SQL|DB2GENRL|DB2GENERAL|DAYS|DAY|DATE|DATAPARTITIONNUM|DATAPARTITIONNAME|DATABASE|DATA|CYCLE|CURSOR|CURRENT_USER|CURRENT_TIMEZONE|CURRENT_TIMESTAMP|CURRENT_TIME|CURRENT_SERVER|CURRENT_SCHEMA|CURRENT_PATH|CURRENT_DATE|CURRENT|CUBE|CROSS|CREATEIN|CREATE|COUNT_BIG|COUNT|COPY|CONTINUE|CONTENT|CONTAINS|CONSTRAINT|CONSTANT|CONNECT_BY_ROOT|CONNECTION|CONNECT|CONDITION|CONCURRENT|CONCAT|COMPRESS|COMPACT|COMMIT|COMMENT|COLUMN|COLLECTION|COLLECT|CLUSTER|CLOSE|CL|CHECK|CHARACTER|CHAR|CCSID|CAST|CASE|CARDINALITY|CALLED|CALL|CACHE|BY|BUFFERPOOL|BIT|BIND|BINARY|BETWEEN|BEGIN|BEFORE|AUTONOMOUS|AUTHORIZATION|ATTRIBUTES|ATOMIC|AT|ASSOCIATE|ASENSITIVE|ASC|AS|ARRAY_AGG|ARRAY|APPLNAME|APPEND|ANY|AND|ALTER|ALLOW|ALLOCATE|ALL|ALIAS|ADD|ACTIVATE|ACTION|ACCTNG|ACCORDING|ABSENT)\b/i,
						alias: 'keyword'
					},
					'freedefkeywords': {
						pattern: /\b(?:ZONED|VARYING|VARUCS2|VARGRAPH|VARCHAR|VALUE|UNS|UCS2|TOFILE|TIMFMT|TIMESTAMP|TIME|TEMPLATE|STATIC|SQLTYPE|SAMEPOS|RTNPARM|REQPROTO|QUALIFIED|PSDS|PROCPTR|PREFIX|POS|POINTER|PGMINFO|PERRCD|PACKEVEN|PACKED|OVERLOAD|OVERLAY|OPTIONS|OPDESC|OCCURS|OBJECT|NULLIND|NOOPT|LIKEREC|LIKEFILE|LIKEDS|LIKE|LEN|INZ|IND|INT|IMPORT|GRAPH|FROMFILE|FLOAT|EXTPROC|EXTPGM|EXTNAME|EXTFMT|EXTFLD|EXT|EXPORT|DTAARA|DIM|DESCEND|DATFMT|DATE|CTDATA|CONST|CLASS|CHAR|CCSID|BINDEC|BASED|ASCEND|ALTSEQ|ALT|ALIGN|ALIAS)\b/i,
						greedy: true,
						alias: 'keyword'
					},
					'brackets': {
						pattern: /[\[\]()]/
					},
					'allfree': {
						pattern: /^\*\*FREE\b/i,
						greedy: true,
						alias: 'keyword'
					}
				};
			  },
			})

  eleventyConfig.addPlugin(pluginSvgSprite, {
    path: "./src/assets/svg",
    globalClasses: "fill-current"
	})

	/**
	 * Filters
	 * @link https://www.11ty.io/docs/filters/
	 */
	Object.keys(filters).forEach((filterName) => {
		eleventyConfig.addFilter(filterName, filters[filterName])
	})

	/**
	 * Transforms
	 * @link https://www.11ty.io/docs/config/#transforms
   Object.keys(transforms).forEach((transformName) => {
     eleventyConfig.addTransform(transformName, transforms[transformName])
    })
    */

	/**
	 * Shortcodes
	 * @link https://www.11ty.io/docs/shortcodes/
	 */
	Object.keys(shortcodes).forEach((shortcodeName) => {
		eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
	})

	/**
	 * Paired Shortcodes
	 * @link https://www.11ty.dev/docs/languages/nunjucks/#paired-shortcode
	 */
	Object.keys(pairedshortcodes).forEach((shortcodeName) => {
		eleventyConfig.addPairedShortcode(
			shortcodeName,
			pairedshortcodes[shortcodeName]
		)
	})

	/**
	 * Collections
	 * ============================
	 *
	 * POST Collection set so we can check status of "draft:" frontmatter.
	 * If set "true" then post will NOT be processed in PRODUCTION env.
	 * If "false" or NULL it will be published in PRODUCTION.
	 * Every Post will ALWAYS be published in DEVELOPMENT so you can preview locally.
	 */
	eleventyConfig.addCollection('post', (collection) => {
		if (process.env.ELEVENTY_PRODUCTION !== 'true')
			return [...collection.getFilteredByGlob('./src/posts/*.md')]
		else
			return [...collection.getFilteredByGlob('./src/posts/*.md')].filter((post) => !post.data.draft)
	})

	// TAGLIST used from the official eleventy-base-blog  https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js
	eleventyConfig.addCollection('tagList', function (collection) {
		let tagSet = new Set()
		collection.getAll().forEach(function (item) {
			if ('tags' in item.data) {
				let tags = item.data.tags

				tags = tags.filter(function (item) {
					switch (item) {
						// this list should match the `filter` list in tags.njk
						case 'authors':
						case 'pages':
						case 'post':
							return false
					}

					return true
				})

				for (const tag of tags) {
					tagSet.add(tag)
				}
			}
		})

		// returning an array in addCollection works in Eleventy 0.5.3
		return [...tagSet]
	})

	/**
	 * Custom Watch Targets
	 * for when the Tailwind config or .css files change...
	 * by default not watched by 11ty
	 * @link https://www.11ty.dev/docs/config/#add-your-own-watch-targets
	 */
	eleventyConfig.addWatchTarget('./src/assets')
	eleventyConfig.addWatchTarget('./utils/*.js')
	eleventyConfig.addWatchTarget('./tailwind.config.js')

	/**
	 * Passthrough File Copy
	 * @link https://www.11ty.dev/docs/copy/
	 */
	eleventyConfig.addPassthroughCopy('src/*.png')
	eleventyConfig.addPassthroughCopy('src/*.jpg')
	eleventyConfig.addPassthroughCopy('src/*.ico')
	eleventyConfig.addPassthroughCopy('src/robots.txt')
	eleventyConfig.addPassthroughCopy('src/assets/images/')
	eleventyConfig.addPassthroughCopy('src/assets/svg/')
	eleventyConfig.addPassthroughCopy('src/assets/video/')
    eleventyConfig.addPassthroughCopy('src/assets/js/')
	eleventyConfig.addPassthroughCopy('src/js')


    /**
	 * Search
	 */
	eleventyConfig.addFilter("search", searchFilter)


	/**
	 * Set custom markdown library instance...
	 * and support for Emojis in markdown...
	 * ...because why not control our .MD files and have Emojis built in?
	 * @link https://www.11ty.dev/docs/languages/markdown/#optional-set-your-own-library-instance
	 * @link https://www.npmjs.com/package/markdown-it-emoji
	 *
	 */
	let options = {
		html: true,
		breaks: true,
		linkify: true,
		typographer: true,
	}
	let markdownLib = markdownIt(options).use(markdownItEmoji)
	eleventyConfig.setLibrary('md', markdownLib)

	/**
	 * Add layout aliases
	 * @link https://www.11ty.dev/docs/layouts/#layout-aliasing
	 */
	eleventyConfig.addLayoutAlias('base', 'layouts/base.njk')
	eleventyConfig.addLayoutAlias('page', 'layouts/page.njk')
	eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')
	eleventyConfig.addLayoutAlias('author', 'layouts/author.njk')

	/**
	 * Opts in to a full deep merge when combining the Data Cascade.
	 * Per the link below, "This will likely become the default in an upcoming major version."
	 * So I'm going to implement it now.
	 * @link https://www.11ty.dev/docs/data-deep-merge/#data-deep-merge
	 */
	eleventyConfig.setDataDeepMerge(true)

	/**
	 * Override BrowserSync Server options
	 * This so we can have and test a 404 during local dev.
	 * @link https://www.11ty.dev/docs/config/#override-browsersync-server-options
	 */
	// eleventyConfig.setBrowserSyncConfig({
	// 	notify: true,
	// 	snippetOptions: {
	// 		rule: {
	// 			match: /<\/head>/i,
	// 			fn: function (snippet, match) {
	// 				return snippet + match
	// 			},
	// 		},
	// 	},
		// Set local server 404 fallback
		// callbacks: {
		// 	ready: function (err, browserSync) {
		// 		const content_404 = fs.readFileSync('dist/404.html')

		// 		browserSync.addMiddleware('*', (req, res) => {
		// 			// Provides the 404 content without redirect.
		// 			res.write(content_404)
		// 			res.end()
		// 		})
		// 	},
		// },
	// })

	return {
		dir: {
			input: 'src',
			output: 'dist',
			includes: '_includes',
			data: '_data',
		},
		passthroughFileCopy: true,
		templateFormats: ['html', 'njk', 'md'],
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk',
	}
}
