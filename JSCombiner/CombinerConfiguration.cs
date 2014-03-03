using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSCombiner
{
	public class CombinerConfiguration
	{
		public List<string> FilesToCombine { get; set; }
		public string Header { get; set; }
		public string Footer { get; set; }
	}
}
