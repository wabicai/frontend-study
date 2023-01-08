let fs = require("fs");
let path = require("path");
// 第一个参数是路径
var filePath = path.resolve("./");
// 统计结果
let num = 0;
line(filePath);

// 获取行数
function line(filePath) {
	fs.readdir(filePath, function (err, files) {
		if (err) {
			console.warn(err);
		} else {
			//遍历读取到的文件列表
			files.forEach(function (filename) {
				//获取当前文件的绝对路径
				var filedir = path.join(filePath, filename);
				//根据文件路径获取文件信息，返回一个fs.Stats对象
				fs.stat(filedir, function (eror, stats) {
					if (eror) {
						console.warn("获取文件stats失败");
					} else {
						var isFile = stats.isFile(); //是文件
						var isDir = stats.isDirectory(); //是文件夹
						if (isFile && filedir.slice(-3) === ".md") {
							// 是文件并且是md文件
							fs.readFile(
								filedir,
								{
									encoding: "utf-8",
								},
								function (err, data) {
									if (err) {
										console.error(err);
									} else {
										let lines = data.split(" ").join("");
										console.log(filedir + " " + lines.length);
										num += lines.length;
									}
								}
							);
						}
						if (isDir) {
							line(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
						}
					}
				});
			});
		}
	});
	console.log(num);
}
function processData(data, filedir) {
	// 关键字
	var key = data.match(/@\{\w*\}@/gm);
	let context = data;
	if (key) {
		key.forEach((item) => {
			if (file[item.slice(2, item.length - 2)]) {
				context = context.replace(
					`${item}`,
					file[item.slice(2, item.length - 2)]
				);
			}
		});
		const filePath = filedir.split("\\").slice(-2);
		const fileRelative =
			filePath[0] === "classroom_docs"
				? `./modified/modified-${filePath[1]}`
				: `./modified/${filePath[0]}/modified-${filePath[1]}`;
		writedir = process.env.NODE_ENV == "production" ? filedir : fileRelative;
		fs.writeFileSync(writedir, context, (err, res) => {
			console.error("writeFileSync", err);
		});
	}
}
