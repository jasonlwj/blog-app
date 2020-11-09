const dummy = blogs => {
	console.log(blogs)
	return 1
}

const totalLikes = blogs => {
	return blogs.reduce(
		(sum, blog) => sum + blog.likes, 
		0
	)
}

const favouriteBlog = blogs => {
	const favourite = blogs.reduce(
		(max, blog) => 
			max.likes > blog.likes 
				? max
				: blog
	)

	return {
		title: favourite.title,
		author: favourite.author,
		likes: favourite.likes
	}
}

const mostBlogs = blogs => {
	const numBlogsByAuthor = blogs.reduce(
		(acc, blog) => {
			const key = blog['author']
			acc[key] = acc[key] || 0
			acc[key]++
			return acc
		},
		{}
	)

	const authorWithMostBlogs = Object.keys(numBlogsByAuthor).reduce(
		(max, author) => 
			numBlogsByAuthor[max] > numBlogsByAuthor[author]
				? max
				: author
	)

	return {
		author: authorWithMostBlogs,
		blogs: numBlogsByAuthor[authorWithMostBlogs]
	}
}

// {
//   author: "Edsger W. Dijkstra",
//   likes: 17
// }
const mostLikes = blogs => {
	const numLikesByAuthor = blogs.reduce(
		(acc, blog) => {
			const key = blog['author']
			acc[key] = acc[key] || 0
			acc[key] += blog['likes']
			return acc
		},
		{}
	)

	const authorWithMostLikes = Object.keys(numLikesByAuthor).reduce(
		(max, author) =>
			numLikesByAuthor[max] > numLikesByAuthor[author]
				? max
				: author
	)

	return {
		author: authorWithMostLikes,
		likes: numLikesByAuthor[authorWithMostLikes]
	}
}

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog,
	mostBlogs,
	mostLikes
}
