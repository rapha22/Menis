using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSCombiner
{
	class Program
	{
		static void Main(string[] args)
		{
			var config = new CombinerConfiguration();

			if (args.Length > 1)
				config.FilesToCombine.AddRange(args);
		}
	}
}
