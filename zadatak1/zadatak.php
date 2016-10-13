<?php



$string = "{ Danas pada { kisa { i ulice su mokre } | snijeg { i ulice su { klizave | bijele }}}. Sutra ce biti lijepo { vrijeme | setati }. }";
printOptions($string);

echo "\n";



function printOptions($str)
{
	$ind = strpos($str, '{');

	if ($ind === false)
	{
		echo $str."\n";
	} else {
		$nestCount = 0;
		$endindex = $ind;

		for ($i=$ind+1; $i < strlen($str) ; $i++) { 
		
			if ($str[$i] == "{")
			{
				$nestCount++;
			} elseif ($str[$i] == "}") {
				if ($nestCount == 0)
				{
					$endindex = $i;
					break;
				}
				$nestCount--;
			}
		}

		if ($endindex == $ind)
		{
			echo "greska";
		}

		$options = [];
		$startIndex = $ind+1;
		$nestCount = 0;

		for ($i=$startIndex; $i < $endindex; $i++) { 

			if ($str[$i] === '{')
			{
				$nestCount++;
			} elseif ($str[$i] === '}') {
				$nestCount--;
			} elseif ($str[$i] === '|') {
				if ($nestCount == 0)
				{
					$option = substr($str, $startIndex, $i-$startIndex);
					$options[] = $option;
					$startIndex = $i + 1;
				}
			}
		}

		if ($startIndex < $endindex-1) {
			$option  = substr($str, $startIndex, $endindex-$startIndex);
			$options[] = $option;
		}

		$prefix = "";
				
		if ($ind > 0)
		{
			$prefix = substr($str, 0, $ind);
		}

		$sufix = '';
		if ($endindex < strlen($str) - 1)
		{
			$sufix = substr($str, $endindex+1,strlen($str)-$endindex);
		}

		foreach ($options as $option) {
			printOptions($prefix.$option.$sufix);
		}
	}

}











