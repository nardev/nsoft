class DFSClass:
	def printOptions(self, s):
		#print(s)
		#prva zagrada
		try:
			ind = s.index('{')
		except:
	        		ind=-1

		if (ind<0): #nema zagrada
			print(s)
		else:
			#naci odgovarajucu }
			nestCount=0
			endIndex=ind
			for i in range(ind+1,len(s)):
				if (s[i]=='{'):
					nestCount+=1
				elif (s[i]=='}'):
					if (nestCount==0):
						endIndex=i
						break
					nestCount-=1

			if (endIndex==ind):
				# nevalja format, nema }
				raise Exception('Invalid format!')

			# naci opcije u zagradi
			options = []
				
			startIndex=ind+1
			nestCount=0
				
			for i in range(startIndex,endIndex):
				if (s[i]=='{'):
					nestCount+=1
				elif (s[i]=='}'):
					nestCount-=1
				elif (s[i]=='|'):
					if (nestCount==0):
						option = s[startIndex:i]
						options.append(option)
						startIndex = i+1
		
			if (startIndex<endIndex-1): #zadnja opcija, ostatak prije }
				option = s[startIndex:endIndex]
				options.append(option)
		
			prefix = ""
			if (ind>0):
				prefix = s[0:ind]
				
			sufix = ""
			if (endIndex<len(s)-1):
				sufix = s[endIndex+1:len(s)]

			#rekurzija, isti string bez prve zagrade
			for option in options:
				self.printOptions(prefix+option+sufix)

result = DFSClass()
str = u'{ Danas pada { kisa { i ulice su mokre } | snijeg { i ulice su { klizave | bijele }}}. Sutra ce biti lijepo { vrijeme | setati }. }'
result.printOptions(str)